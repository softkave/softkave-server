import { IBlock } from "../../../mongo/block";
import { INotification } from "../../../mongo/notification/definitions";
import { IUser } from "../../../mongo/user/definitions";
import {
    getPublicNotificationData,
    getPublicNotificationsArray,
} from "../../notifications/utils";
import {
    IOutgoingNewNotificationsPacket,
    OutgoingSocketEvents,
} from "../../socket/outgoingEventTypes";
import { IAddCollaboratorsContext } from "./types";

export interface IAddCollaboratorsBroadcastFnData {
    collaborationRequests: INotification[];
    block: IBlock;
    indexedExistingUsers: { [key: string]: IUser };
}

export function broadcastToOrgsAndExistingUsers(
    context: IAddCollaboratorsContext,
    data: IAddCollaboratorsBroadcastFnData
) {
    const { collaborationRequests, block, indexedExistingUsers } = data;

    const orgBroadcastPacket: IOutgoingNewNotificationsPacket = {
        notifications: getPublicNotificationsArray(collaborationRequests),
    };

    const blockRoomName = context.room.getBlockRoomName(
        block.type,
        block.customId
    );

    context.room.broadcast(
        context,
        blockRoomName,
        OutgoingSocketEvents.OrgNewCollaborationRequests,
        orgBroadcastPacket
    );

    collaborationRequests.forEach((request) => {
        const existingUser = indexedExistingUsers[request.to.email];

        if (!existingUser) {
            return;
        }

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
            newRequestPacket
        );
    });
}
