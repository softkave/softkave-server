import { BlockType, IBlock } from "../../mongo/block";
import { IChat } from "../../mongo/chat";
import { INotification } from "../../mongo/notification";
import { IRoom } from "../../mongo/room";
import { ISprint } from "../../mongo/sprint";
import { IUser } from "../../mongo/user";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { getDateString } from "../../utilities/fns";
import { getPublicBlockData } from "../block/utils";
import { getPublicChatData, getPublicRoomData } from "../chat/utils";
import {
    getPublicNotificationData,
    getPublicNotificationsArray,
} from "../notifications/utils";
import RequestData from "../RequestData";
import {
    IOutgoingBlockUpdatePacket,
    IOutgoingDeleteSprintPacket,
    IOutgoingEndSprintPacket,
    IOutgoingNewNotificationsPacket,
    IOutgoingNewRoomPacket,
    IOutgoingNewSprintPacket,
    IOutgoingSendMessagePacket,
    IOutgoingStartSprintPacket,
    IOutgoingUpdateRoomReadCounterPacket,
    IOutgoingUserUpdatePacket,
    OutgoingSocketEvents,
} from "../socket/outgoingEventTypes";
import { getPublicSprintData } from "../sprints/utils";
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
        instData: RequestData,
        args: IBroadcastBlockUpdateArgs
    ) => Promise<void>;
    broadcastNewOrgCollaborationRequest: (
        context: IBaseContext,
        instData: RequestData,
        block: IBlock,
        collaborationRequests: INotification[]
    ) => void;
    broadcastNewUserCollaborationRequest: (
        context: IBaseContext,
        instData: RequestData,
        existingUser: IUser,
        request: INotification
    ) => void;
    broadcastUserUpdate: (
        context: IBaseContext,
        instData: RequestData,
        user: IUser,
        data: Partial<IUser>
    ) => void;
    broadcastCollaborationRequestsUpdate: () => void;
    broadcastCollaborationRequestResponse: () => void;
    broadcastNewRoom: (
        context: IBaseContext,
        instData: RequestData,
        room: IRoom
    ) => void;
    broadcastNewMessage: (
        context: IBaseContext,
        instData: RequestData,
        room: IRoom,
        chat: IChat
    ) => void;
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
        sprint: ISprint
    ) => void;
    broadcastSprintUpdate: (
        context: IBaseContext,
        instData: RequestData,
        user: IUser,
        board: IBlock,
        sprint: ISprint,
        endDateStr: string
    ) => void;
    broadcastEndSprint: () => void;
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
    public broadcastBlockUpdate = wrapFireAndDontThrow(
        async (
            context: IBaseContext,
            instData: RequestData,
            args: IBroadcastBlockUpdateArgs
        ) => {
            const { updateType, blockId, data, blockType } = args;
            let { block, parentId } = args;
            const user = await context.session.getUser(context, instData);

            // TODO: should we do this here, for performance reasons?
            //      or should we pass it in from the caller

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

    public broadcastNewOrgCollaborationRequest = wrapFireAndDontThrow(
        (
            context: IBaseContext,
            instData: RequestData,
            block: IBlock,
            collaborationRequests: INotification[]
        ) => {
            const orgBroadcastPacket: IOutgoingNewNotificationsPacket = {
                notifications: getPublicNotificationsArray(
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
            instData: RequestData,
            existingUser: IUser,
            request: INotification
        ) => {
            const userRoomName = context.room.getUserRoomName(
                existingUser.customId
            );

            const newRequestPacket: IOutgoingNewNotificationsPacket = {
                notifications: [getPublicNotificationData(request)],
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
                userRoomName,
                OutgoingSocketEvents.UserUpdate,
                broadcastData,
                instData
            );
        }
    );

    public broadcastNewRoom = wrapFireAndDontThrow(
        (context: IBaseContext, instData: RequestData, room: IRoom) => {
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
            instData: RequestData,
            room: IRoom,
            chat: IChat
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
            instData: RequestData,
            user: IUser,
            roomId: string,
            readCounter: string
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
            instData: RequestData,
            board: IBlock,
            sprint: ISprint
        ) => {
            const roomName = context.room.getBlockRoomName(
                board.type,
                board.customId
            );
            const newSprintPacket: IOutgoingNewSprintPacket = {
                sprint: getPublicSprintData(sprint),
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
                roomName,
                OutgoingSocketEvents.UpdateSprint,
                updateSprintPacket,
                instData
            );
        }
    );

    public broadcastStartSprint = wrapFireAndDontThrow(
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
                roomName,
                OutgoingSocketEvents.DeleteSprint,
                deleteSprintPacket,
                instData
            );
        }
    );

    public broadcastCollaborationRequestsUpdate = wrapFireAndDontThrow(
        () => {}
    );

    public broadcastCollaborationRequestResponse = wrapFireAndDontThrow(
        () => {}
    );

    public broadcastEndSprint = wrapFireAndDontThrow(() => {});
}

export const getBroadcastHelpers = createSingletonFunc(
    () => new BroadcastHelpers()
);
