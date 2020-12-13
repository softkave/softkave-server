import { BlockType, IBlock } from "../../mongo/block";
import { IChat } from "../../mongo/chat";
import {
    CollaborationRequestResponse,
    CollaborationRequestStatusType,
    ICollaborationRequest,
} from "../../mongo/collaboration-request";
import { INotification } from "../../mongo/notification";
import { IRoom } from "../../mongo/room";
import { ISprint } from "../../mongo/sprint";
import { IUser } from "../../mongo/user";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDateString } from "../../utilities/fns";
import { IUpdateItemById } from "../../utilities/types";
import { IPublicBlock } from "../block/types";
import { getPublicBlockData } from "../block/utils";
import { getPublicChatData, getPublicRoomData } from "../chat/utils";
import {
    IPublicCollaborationRequest,
    IPublicNotificationData,
} from "../notifications/types";
import {
    getPublicCollaborationRequest,
    getPublicCollaborationRequestArray,
    getPublicNotificationData,
    getPublicNotificationsArray,
} from "../notifications/utils";
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
import { wrapFireAndDontThrow } from "../utils";
import { IBaseContext } from "./BaseContext";

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
        args: IBroadcastBlockUpdateArgs,
        instData?: RequestData
    ) => Promise<void>;
    broadcastNewOrgCollaborationRequests: (
        context: IBaseContext,
        block: IBlock,
        collaborationRequests: ICollaborationRequest[],
        instData?: RequestData
    ) => void;
    broadcastNewUserCollaborationRequest: (
        context: IBaseContext,
        existingUser: IUser,
        request: ICollaborationRequest,
        instData?: RequestData
    ) => void;
    broadcastUserUpdate: (
        context: IBaseContext,
        user: IUser,
        data: Partial<IUser>,
        instData?: RequestData
    ) => void;
    broadcastCollaborationRequestsUpdateToBlock: (
        context: IBaseContext,
        block: IBlock,
        updates: Array<IUpdateItemById<IPublicCollaborationRequest>>,
        instData?: RequestData
    ) => void;
    broadcastCollaborationRequestsUpdateToUser: (
        context: IBaseContext,
        user: IUser,
        updates: Array<IUpdateItemById<IPublicCollaborationRequest>>,
        instData?: RequestData
    ) => void;
    broadcastCollaborationRequestResponse: (
        context: IBaseContext,
        user: IUser,
        request: ICollaborationRequest,
        response: CollaborationRequestResponse,
        respondedAt: string,
        org: IPublicBlock,
        instData?: RequestData
    ) => void;
    broadcastNewRoom: (
        context: IBaseContext,
        room: IRoom,
        instData?: RequestData
    ) => void;
    broadcastNewMessage: (
        context: IBaseContext,
        room: IRoom,
        chat: IChat,
        instData?: RequestData
    ) => void;
    broadcastRoomReadCounterUpdate: (
        context: IBaseContext,
        user: IUser,
        roomId: string,
        readCounter: string,
        instData?: RequestData
    ) => void;
    broadcastNewSprint: (
        context: IBaseContext,
        board: IBlock,
        sprint: IPublicSprint,
        instData?: RequestData
    ) => void;
    broadcastSprintUpdate: (
        context: IBaseContext,
        user: IUser,
        board: IBlock,
        sprint: ISprint,
        data: Partial<ISprint>,
        updatedAtStr: string,
        instData?: RequestData
    ) => void;
    broadcastEndSprint: (
        context: IBaseContext,
        user: IUser,
        board: IBlock,
        sprint: ISprint,
        endDateStr: string,
        instData?: RequestData
    ) => void;
    broadcastStartSprint: (
        context: IBaseContext,
        user: IUser,
        board: IBlock,
        sprint: ISprint,
        startDateStr: string,
        instData?: RequestData
    ) => void;
    broadcastDeleteSprint: (
        context: IBaseContext,
        board: IBlock,
        sprint: ISprint,
        instData?: RequestData
    ) => void;
}

export default class BroadcastHelpers implements IBroadcastHelpers {
    public broadcastBlockUpdate = wrapFireAndDontThrow(
        async (
            context: IBaseContext,
            args: IBroadcastBlockUpdateArgs,
            instData?: RequestData
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

            if (blockType === BlockType.Org) {
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
                        userRoomName,
                        event,
                        eventData,
                        instData
                    );

                    return;
                }

                const orgCollaborators = await context.user.getOrgUsers(
                    context,
                    blockId
                );

                orgCollaborators.forEach((collaborator) => {
                    const roomName = context.room.getUserRoomName(
                        collaborator.customId
                    );

                    context.room.broadcast(
                        context,
                        roomName,
                        event,
                        eventData,
                        instData
                    );
                });

                // TODO: manage room broadcasts yourself, cause if an org is deleted,
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
                    BlockType.Org,
                    parentId
                );
                context.room.broadcast(
                    context,
                    roomName,
                    event,
                    eventData,
                    instData
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
                    roomName,
                    event,
                    eventData,
                    instData
                );
                return;
            }
        }
    );

    public broadcastNewOrgCollaborationRequests = wrapFireAndDontThrow(
        (
            context: IBaseContext,
            block: IBlock,
            collaborationRequests: ICollaborationRequest[],
            instData?: RequestData
        ) => {
            const orgBroadcastPacket: IOutgoingNewCollaborationRequestsPacket = {
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
                blockRoomName,
                OutgoingSocketEvents.OrgNewCollaborationRequests,
                orgBroadcastPacket,
                instData
            );
        }
    );

    public broadcastNewUserCollaborationRequest = wrapFireAndDontThrow(
        (
            context: IBaseContext,
            existingUser: IUser,
            request: ICollaborationRequest,
            instData?: RequestData
        ) => {
            const userRoomName = context.room.getUserRoomName(
                existingUser.customId
            );

            const newRequestPacket: IOutgoingNewCollaborationRequestsPacket = {
                requests: [getPublicCollaborationRequest(request)],
            };

            context.room.broadcast(
                context,
                userRoomName,
                OutgoingSocketEvents.UserNewCollaborationRequest,
                newRequestPacket,
                instData
            );
        }
    );

    public broadcastUserUpdate = wrapFireAndDontThrow(
        (
            context: IBaseContext,
            user: IUser,
            data: Partial<IUser>,
            instData?: RequestData
        ) => {
            const broadcastData: IOutgoingUserUpdatePacket = {
                notificationsLastCheckedAt: getDateString(
                    data.notificationsLastCheckedAt
                ),
            };

            const userRoomName = context.room.getUserRoomName(user.customId);
            context.room.broadcast(
                context,
                userRoomName,
                OutgoingSocketEvents.UserUpdate,
                broadcastData,
                instData
            );
        }
    );

    public broadcastNewRoom = wrapFireAndDontThrow(
        (context: IBaseContext, room: IRoom, instData?: RequestData) => {
            const newRoomPacket: IOutgoingNewRoomPacket = {
                room: getPublicRoomData(room),
            };

            context.room.broadcast(
                context,
                room.name,
                OutgoingSocketEvents.NewRoom,
                newRoomPacket,
                instData
            );
        }
    );

    public broadcastNewMessage = wrapFireAndDontThrow(
        (
            context: IBaseContext,
            room: IRoom,
            chat: IChat,
            instData?: RequestData
        ) => {
            const outgoingNewMessagePacket: IOutgoingSendMessagePacket = {
                chat: getPublicChatData(chat),
            };

            context.room.broadcast(
                context,
                room.name,
                OutgoingSocketEvents.NewMessage,
                outgoingNewMessagePacket,
                instData
            );
        }
    );

    public broadcastRoomReadCounterUpdate = wrapFireAndDontThrow(
        (
            context: IBaseContext,
            user: IUser,
            roomId: string,
            readCounter: string,
            instData?: RequestData
        ) => {
            const roomSignature = context.room.getChatRoomName(roomId);
            const outgoingUpdateRoomCounterPacket: IOutgoingUpdateRoomReadCounterPacket = {
                roomId,
                member: { readCounter, userId: user.customId },
            };

            context.room.broadcast(
                context,
                roomSignature,
                OutgoingSocketEvents.UpdateRoomReadCounter,
                outgoingUpdateRoomCounterPacket,
                instData
            );
        }
    );

    public broadcastNewSprint = wrapFireAndDontThrow(
        (
            context: IBaseContext,
            board: IBlock,
            sprint: IPublicSprint,
            instData?: RequestData
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
                roomName,
                OutgoingSocketEvents.NewSprint,
                newSprintPacket,
                instData
            );
        }
    );

    public broadcastSprintUpdate = wrapFireAndDontThrow(
        (
            context: IBaseContext,
            user: IUser,
            board: IBlock,
            sprint: ISprint,
            data: Partial<ISprint>,
            updatedAtStr: string,
            instData?: RequestData
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
                roomName,
                OutgoingSocketEvents.UpdateSprint,
                startSprintPacket,
                instData
            );
        }
    );

    public broadcastStartSprint = wrapFireAndDontThrow(
        (
            context: IBaseContext,
            user: IUser,
            board: IBlock,
            sprint: ISprint,
            startDateStr: string,
            instData?: RequestData
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
                roomName,
                OutgoingSocketEvents.StartSprint,
                startSprintPacket,
                instData
            );
        }
    );

    public broadcastDeleteSprint = wrapFireAndDontThrow(
        (
            context: IBaseContext,
            board: IBlock,
            sprint: ISprint,
            instData?: RequestData
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
                roomName,
                OutgoingSocketEvents.DeleteSprint,
                deleteSprintPacket,
                instData
            );
        }
    );

    public broadcastCollaborationRequestsUpdateToBlock = wrapFireAndDontThrow(
        (
            context: IBaseContext,
            block: IBlock,
            updates: Array<IUpdateItemById<IPublicCollaborationRequest>>,
            instData?: RequestData
        ) => {
            const updateNotificationsPacket: IOutgoingUpdateCollaborationRequestsPacket = {
                requests: updates,
            };

            const blockRoomName = context.room.getBlockRoomName(
                block.type,
                block.customId
            );

            context.room.broadcast(
                context,
                blockRoomName,
                OutgoingSocketEvents.UpdateCollaborationRequests,
                updateNotificationsPacket,
                instData
            );
        }
    );

    public broadcastCollaborationRequestsUpdateToUser = wrapFireAndDontThrow(
        (
            context: IBaseContext,
            user: IUser,
            updates: Array<IUpdateItemById<IPublicCollaborationRequest>>,
            instData?: RequestData
        ) => {
            const updateNotificationsPacket: IOutgoingUpdateCollaborationRequestsPacket = {
                requests: updates,
            };

            const userRoomName = context.room.getUserRoomName(user.customId);

            context.room.broadcast(
                context,
                userRoomName,
                OutgoingSocketEvents.UpdateCollaborationRequests,
                updateNotificationsPacket,
                instData
            );
        }
    );

    public broadcastCollaborationRequestResponse = wrapFireAndDontThrow(
        (
            context: IBaseContext,
            user: IUser,
            request: ICollaborationRequest,
            response: CollaborationRequestResponse,
            respondedAt: string,
            org: IPublicBlock,
            instData?: RequestData
        ) => {
            const orgRoomName = context.room.getBlockRoomName(
                org.type,
                org.customId
            );
            const orgsBroadcastData: IOutgoingCollaborationRequestResponsePacket = {
                response,
                respondedAt,
                customId: request.customId,
            };

            context.room.broadcast(
                context,
                orgRoomName,
                OutgoingSocketEvents.CollaborationRequestResponse,
                orgsBroadcastData,
                instData
            );

            const userRoomName = context.room.getUserRoomName(user.customId);
            const userClientsBroadcastData: IOutgoingCollaborationRequestResponsePacket = {
                response,
                respondedAt,
                customId: request.customId,
                org:
                    response === CollaborationRequestStatusType.Accepted
                        ? org
                        : undefined,
            };

            context.room.broadcast(
                context,
                userRoomName,
                OutgoingSocketEvents.CollaborationRequestResponse,
                userClientsBroadcastData,
                instData
            );
        }
    );

    public broadcastEndSprint = wrapFireAndDontThrow(
        (
            context: IBaseContext,
            user: IUser,
            board: IBlock,
            sprint: ISprint,
            endDateStr: string,
            instData?: RequestData
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
                roomName,
                OutgoingSocketEvents.EndSprint,
                updateSprintPacket,
                instData
            );
        }
    );
}

export const getBroadcastHelpers = makeSingletonFunc(
    () => new BroadcastHelpers()
);
