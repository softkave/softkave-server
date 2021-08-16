import { BlockType, IBlock } from "../../mongo/block";
import { IChat } from "../../mongo/chat";
import {
    CollaborationRequestResponse,
    CollaborationRequestStatusType,
    ICollaborationRequest,
} from "../../mongo/collaboration-request";
import { IRoom } from "../../mongo/room";
import { ISprint } from "../../mongo/sprint";
import { IUser } from "../../mongo/user";
import getSingletonFunc from "../../utilities/createSingletonFunc";
import { getDateString } from "../../utilities/fns";
import { IUpdateItemById } from "../../utilities/types";
import { IPublicBlock } from "../block/types";
import { getPublicBlockData } from "../block/utils";
import { getPublicChatData, getPublicRoomData } from "../chat/utils";
import { IPublicCollaborationRequest } from "../collaborationRequest/types";
import {
    getPublicCollaborationRequestArray,
    getPublicCollaborationRequest,
} from "../collaborationRequest/utils";
import RequestData from "../RequestData";
import {
    IOutgoingBlockUpdatePacket,
    IOutgoingCollaborationRequestResponsePacket,
    IOutgoingDeleteSprintPacket,
    IOutgoingEndSprintPacket,
    IOutgoingNewCollaborationRequestsPacket,
    IOutgoingNewRoomPacket,
    IOutgoingNewSprintPacket,
    IOutgoingSendMessagePacket,
    IOutgoingStartSprintPacket,
    IOutgoingUpdateCollaborationRequestsPacket,
    IOutgoingUpdateRoomReadCounterPacket,
    IOutgoingUpdateSprintPacket,
    IOutgoingUserUpdatePacket,
    OutgoingSocketEvents,
} from "../socket/outgoingEventTypes";
import { IPublicSprint } from "../sprints/types";
import { wrapFireAndThrowErrorAsync } from "../utils";
import { IBaseContext } from "./BaseContext";
import { IBroadcastResult } from "./RoomContext";

interface IBroadcastBlockUpdateArgs {
    blockId: string;
    updateType: { isNew?: boolean; isUpdate?: boolean; isDelete?: boolean };
    blockType: BlockType;
    data?: Partial<IBlock>;
    parentId?: string;
    block?: IBlock;
}

export interface IBroadcastHelpers {
    broadcastBlockUpdate: (
        context: IBaseContext,
        instData: RequestData,
        args: IBroadcastBlockUpdateArgs
    ) => Promise<void>;
    broadcastNewOrganizationCollaborationRequests: (
        context: IBaseContext,
        instData: RequestData,
        block: IBlock,
        collaborationRequests: ICollaborationRequest[]
    ) => void;
    broadcastNewUserCollaborationRequest: (
        context: IBaseContext,
        instData: RequestData,
        existingUser: IUser,
        request: ICollaborationRequest
    ) => void;
    broadcastUserUpdate: (
        context: IBaseContext,
        instData: RequestData,
        user: IUser,
        data: Partial<IUser>
    ) => void;
    broadcastCollaborationRequestsUpdateToBlock: (
        context: IBaseContext,
        instData: RequestData,
        block: IBlock,
        updates: Array<IUpdateItemById<IPublicCollaborationRequest>>
    ) => void;
    broadcastCollaborationRequestsUpdateToUser: (
        context: IBaseContext,
        instData: RequestData,
        user: IUser,
        updates: Array<IUpdateItemById<IPublicCollaborationRequest>>
    ) => void;
    broadcastCollaborationRequestResponse: (
        context: IBaseContext,
        instData: RequestData,
        user: IUser,
        request: ICollaborationRequest,
        response: CollaborationRequestResponse,
        respondedAt: string,
        organization: IPublicBlock
    ) => void;
    broadcastNewRoom: (
        context: IBaseContext,
        instData: RequestData,
        room: IRoom,
        excludeSender?: boolean
    ) => void;
    broadcastNewMessage: (
        context: IBaseContext,
        instData: RequestData,
        room: IRoom,
        chat: IChat
    ) => Promise<IBroadcastResult>;
    broadcastRoomReadCounterUpdate: (
        context: IBaseContext,
        instData: RequestData,
        user: IUser,
        roomId: string,
        readCounter: string
    ) => void;
    broadcastNewSprint: (
        context: IBaseContext,
        instData: RequestData,
        board: IBlock,
        sprint: IPublicSprint
    ) => void;
    broadcastSprintUpdate: (
        context: IBaseContext,
        instData: RequestData,
        user: IUser,
        board: IBlock,
        sprint: ISprint,
        data: Partial<ISprint>,
        updatedAtStr: string
    ) => void;
    broadcastEndSprint: (
        context: IBaseContext,
        instData: RequestData,
        user: IUser,
        board: IBlock,
        sprint: ISprint,
        endDateStr: string
    ) => void;
    broadcastStartSprint: (
        context: IBaseContext,
        instData: RequestData,
        user: IUser,
        board: IBlock,
        sprint: ISprint,
        startDateStr: string
    ) => void;
    broadcastDeleteSprint: (
        context: IBaseContext,
        instData: RequestData,
        board: IBlock,
        sprint: ISprint
    ) => void;
}

export default class BroadcastHelpers implements IBroadcastHelpers {
    public broadcastBlockUpdate = wrapFireAndThrowErrorAsync(
        async (
            context: IBaseContext,
            instData: RequestData,
            args: IBroadcastBlockUpdateArgs
        ) => {
            const { updateType, blockId, data, blockType } = args;
            let { block, parentId } = args;

            // TODO: should we do this here, for performance reasons?
            // or should we pass it in from the caller

            const eventData: IOutgoingBlockUpdatePacket = {
                customId: blockId,
                ...updateType,
            };

            const event = OutgoingSocketEvents.BlockUpdate;

            if (updateType.isNew || updateType.isUpdate) {
                // TODO: should we convert the blocks returned from the endpoints to public blocks?
                // Pro: when we eventually implement REST API for the endpoints, it'll prevent
                //      the client having access to internal data
                // Con: it may be slower, considering that graphql already kind of does this
                // Idea: maybe convert the REST version, and others, but leave the endpoints themselves
                // clean
                eventData.block = getPublicBlockData(data);
            }

            if (blockType === BlockType.Organization) {
                if (updateType.isNew) {
                    const user = await context.session.getUser(
                        context,
                        instData
                    );

                    const userRoomName = context.room.getUserRoomName(
                        user.customId
                    );

                    context.room.broadcast(
                        context,
                        instData,
                        userRoomName,
                        event,
                        eventData,
                        true
                    );

                    return;
                }

                const organizationCollaborators =
                    await context.user.getOrganizationUsers(context, blockId);

                organizationCollaborators.forEach((collaborator) => {
                    const roomName = context.room.getUserRoomName(
                        collaborator.customId
                    );

                    context.room.broadcast(
                        context,
                        instData,
                        roomName,
                        event,
                        eventData,
                        true
                    );
                });

                // TODO: manage room broadcasts yourself, cause if an organization is deleted,
                //      the room still remains in memory, and there's currently no way to get
                //      rid of it, except if everybody leaves the room
                return;
            }

            if (!parentId) {
                if (!block) {
                    block = await context.block.getBlockById(context, blockId);
                }

                parentId = block.parent!;
            }

            if (blockType === BlockType.Board) {
                const roomName = context.room.getBlockRoomName(
                    BlockType.Organization,
                    parentId
                );
                context.room.broadcast(
                    context,
                    instData,
                    roomName,
                    event,
                    eventData,
                    true
                );
                return;
            }

            if (block.type === BlockType.Task) {
                const roomName = context.room.getBlockRoomName(
                    BlockType.Board,
                    parentId
                );

                context.room.broadcast(
                    context,
                    instData,
                    roomName,
                    event,
                    eventData,
                    true
                );
                return;
            }
        }
    );

    public broadcastNewOrganizationCollaborationRequests =
        wrapFireAndThrowErrorAsync(
            (
                context: IBaseContext,
                instData: RequestData,
                block: IBlock,
                collaborationRequests: ICollaborationRequest[]
            ) => {
                const organizationBroadcastPacket: IOutgoingNewCollaborationRequestsPacket =
                    {
                        requests: getPublicCollaborationRequestArray(
                            collaborationRequests
                        ),
                    };

                const blockRoomName = context.room.getBlockRoomName(
                    block.type,
                    block.customId
                );

                context.room.broadcast(
                    context,
                    instData,
                    blockRoomName,
                    OutgoingSocketEvents.OrganizationNewCollaborationRequests,
                    organizationBroadcastPacket,
                    true
                );
            }
        );

    public broadcastNewUserCollaborationRequest = wrapFireAndThrowErrorAsync(
        (
            context: IBaseContext,
            instData: RequestData,
            existingUser: IUser,
            request: ICollaborationRequest
        ) => {
            const userRoomName = context.room.getUserRoomName(
                existingUser.customId
            );

            const newRequestPacket: IOutgoingNewCollaborationRequestsPacket = {
                requests: [getPublicCollaborationRequest(request)],
            };

            context.room.broadcast(
                context,
                instData,
                userRoomName,
                OutgoingSocketEvents.UserNewCollaborationRequest,
                newRequestPacket,
                true
            );
        }
    );

    public broadcastUserUpdate = wrapFireAndThrowErrorAsync(
        (
            context: IBaseContext,
            instData: RequestData,
            user: IUser,
            data: Partial<IUser>
        ) => {
            const broadcastData: IOutgoingUserUpdatePacket = {
                notificationsLastCheckedAt: getDateString(
                    data.notificationsLastCheckedAt
                ),
            };

            const userRoomName = context.room.getUserRoomName(user.customId);
            context.room.broadcast(
                context,
                instData,
                userRoomName,
                OutgoingSocketEvents.UserUpdate,
                broadcastData,
                true
            );
        }
    );

    public broadcastNewRoom = wrapFireAndThrowErrorAsync(
        (
            context: IBaseContext,
            instData: RequestData,
            room: IRoom,
            excludeSender?: boolean
        ) => {
            const newRoomPacket: IOutgoingNewRoomPacket = {
                room: getPublicRoomData(room),
            };

            context.room.broadcast(
                context,
                instData,
                room.name,
                OutgoingSocketEvents.NewRoom,
                newRoomPacket,
                excludeSender
            );
        }
    );

    public broadcastNewMessage = wrapFireAndThrowErrorAsync(
        (
            context: IBaseContext,
            instData: RequestData,
            room: IRoom,
            chat: IChat
        ) => {
            const outgoingNewMessagePacket: IOutgoingSendMessagePacket = {
                chat: getPublicChatData(chat),
            };

            return context.room.broadcast(
                context,
                instData,
                room.name,
                OutgoingSocketEvents.NewMessage,
                outgoingNewMessagePacket,
                true
            );
        }
    );

    public broadcastRoomReadCounterUpdate = wrapFireAndThrowErrorAsync(
        (
            context: IBaseContext,
            instData: RequestData,
            user: IUser,
            roomId: string,
            readCounter: string
        ) => {
            const roomSignature = context.room.getChatRoomName(roomId);
            const outgoingUpdateRoomCounterPacket: IOutgoingUpdateRoomReadCounterPacket =
                {
                    roomId,
                    member: { readCounter, userId: user.customId },
                };

            context.room.broadcast(
                context,
                instData,
                roomSignature,
                OutgoingSocketEvents.UpdateRoomReadCounter,
                outgoingUpdateRoomCounterPacket,
                true
            );
        }
    );

    public broadcastNewSprint = wrapFireAndThrowErrorAsync(
        (
            context: IBaseContext,
            instData: RequestData,
            board: IBlock,
            sprint: IPublicSprint
        ) => {
            const roomName = context.room.getBlockRoomName(
                board.type,
                board.customId
            );
            const newSprintPacket: IOutgoingNewSprintPacket = {
                sprint,
            };

            context.room.broadcast(
                context,
                instData,
                roomName,
                OutgoingSocketEvents.NewSprint,
                newSprintPacket,
                true
            );
        }
    );

    public broadcastSprintUpdate = wrapFireAndThrowErrorAsync(
        (
            context: IBaseContext,
            instData: RequestData,
            user: IUser,
            board: IBlock,
            sprint: ISprint,
            data: Partial<ISprint>,
            updatedAtStr: string
        ) => {
            const roomName = context.room.getBlockRoomName(
                board.type,
                board.customId
            );
            const startSprintPacket: IOutgoingUpdateSprintPacket = {
                sprintId: sprint.customId,
                data: {
                    ...data,
                    updatedAt: updatedAtStr,
                    updatedBy: user.customId,
                },
            };

            context.room.broadcast(
                context,
                instData,
                roomName,
                OutgoingSocketEvents.UpdateSprint,
                startSprintPacket,
                true
            );
        }
    );

    public broadcastStartSprint = wrapFireAndThrowErrorAsync(
        (
            context: IBaseContext,
            instData: RequestData,
            user: IUser,
            board: IBlock,
            sprint: ISprint,
            startDateStr: string
        ) => {
            const roomName = context.room.getBlockRoomName(
                board.type,
                board.customId
            );
            const startSprintPacket: IOutgoingStartSprintPacket = {
                sprintId: sprint.customId,
                startedAt: startDateStr,
                startedBy: user.customId,
            };

            context.room.broadcast(
                context,
                instData,
                roomName,
                OutgoingSocketEvents.StartSprint,
                startSprintPacket,
                true
            );
        }
    );

    public broadcastDeleteSprint = wrapFireAndThrowErrorAsync(
        (
            context: IBaseContext,
            instData: RequestData,
            board: IBlock,
            sprint: ISprint
        ) => {
            const roomName = context.room.getBlockRoomName(
                board.type,
                board.customId
            );
            const deleteSprintPacket: IOutgoingDeleteSprintPacket = {
                sprintId: sprint.customId,
            };

            context.room.broadcast(
                context,
                instData,
                roomName,
                OutgoingSocketEvents.DeleteSprint,
                deleteSprintPacket,
                true
            );
        }
    );

    public broadcastCollaborationRequestsUpdateToBlock =
        wrapFireAndThrowErrorAsync(
            (
                context: IBaseContext,
                instData: RequestData,
                block: IBlock,
                updates: Array<IUpdateItemById<IPublicCollaborationRequest>>
            ) => {
                const updateNotificationsPacket: IOutgoingUpdateCollaborationRequestsPacket =
                    {
                        requests: updates,
                    };

                const blockRoomName = context.room.getBlockRoomName(
                    block.type,
                    block.customId
                );

                context.room.broadcast(
                    context,
                    instData,
                    blockRoomName,
                    OutgoingSocketEvents.UpdateCollaborationRequests,
                    updateNotificationsPacket,
                    true
                );
            }
        );

    public broadcastCollaborationRequestsUpdateToUser =
        wrapFireAndThrowErrorAsync(
            (
                context: IBaseContext,
                instData: RequestData,
                user: IUser,
                updates: Array<IUpdateItemById<IPublicCollaborationRequest>>
            ) => {
                const updateNotificationsPacket: IOutgoingUpdateCollaborationRequestsPacket =
                    {
                        requests: updates,
                    };

                const userRoomName = context.room.getUserRoomName(
                    user.customId
                );

                context.room.broadcast(
                    context,
                    instData,
                    userRoomName,
                    OutgoingSocketEvents.UpdateCollaborationRequests,
                    updateNotificationsPacket,
                    true
                );
            }
        );

    public broadcastCollaborationRequestResponse = wrapFireAndThrowErrorAsync(
        (
            context: IBaseContext,
            instData: RequestData,
            user: IUser,
            request: ICollaborationRequest,
            response: CollaborationRequestResponse,
            respondedAt: string,
            organization: IPublicBlock
        ) => {
            const organizationRoomName = context.room.getBlockRoomName(
                organization.type,
                organization.customId
            );
            const organizationsBroadcastData: IOutgoingCollaborationRequestResponsePacket =
                {
                    response,
                    respondedAt,
                    customId: request.customId,
                };

            context.room.broadcast(
                context,
                instData,
                organizationRoomName,
                OutgoingSocketEvents.CollaborationRequestResponse,
                organizationsBroadcastData,
                true
            );

            const userRoomName = context.room.getUserRoomName(user.customId);
            const userClientsBroadcastData: IOutgoingCollaborationRequestResponsePacket =
                {
                    response,
                    respondedAt,
                    customId: request.customId,
                    organization:
                        response === CollaborationRequestStatusType.Accepted
                            ? organization
                            : undefined,
                };

            context.room.broadcast(
                context,
                instData,
                userRoomName,
                OutgoingSocketEvents.CollaborationRequestResponse,
                userClientsBroadcastData,
                true
            );
        }
    );

    public broadcastEndSprint = wrapFireAndThrowErrorAsync(
        (
            context: IBaseContext,
            instData: RequestData,
            user: IUser,
            board: IBlock,
            sprint: ISprint,
            endDateStr: string
        ) => {
            const roomName = context.room.getBlockRoomName(
                board.type,
                board.customId
            );
            const updateSprintPacket: IOutgoingEndSprintPacket = {
                sprintId: sprint.customId,
                endedAt: endDateStr,
                endedBy: user.customId,
            };

            context.room.broadcast(
                context,
                instData,
                roomName,
                OutgoingSocketEvents.EndSprint,
                updateSprintPacket,
                true
            );
        }
    );
}

export const getBroadcastHelpers = getSingletonFunc(
    () => new BroadcastHelpers()
);
