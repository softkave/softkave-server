import { IChat } from "../../mongo/chat";
import { IRoom } from "../../mongo/room";
import { SprintDuration } from "../../mongo/sprint";
import { IPublicBlock } from "../block/types";
import { IPublicChatData, IPublicRoomData } from "../chat/types";
import { IPublicNotificationData } from "../notifications/types";
import { IPublicSprint } from "../sprints/types";
import { CollaborationRequestResponse } from "../user/respondToCollaborationRequest/types";

export enum OutgoingSocketEvents {
    BlockUpdate = "blockUpdate",
    OrgNewCollaborationRequests = "orgNewCollaborationRequests",
    UserNewCollaborationRequest = "userNewCollaborationRequest",
    UserUpdate = "userUpdate",
    UpdateCollaborationRequests = "updateCollaborationRequests",
    CollaborationRequestResponse = "collabReqResponse",
    NewRoom = "newRoom",
    NewMessage = "newMessage",
    UpdateRoomReadCounter = "updateRoomReadCounter",
    NewSprint = "newSprint",
    UpdateSprint = "updateSprint",
    EndSprint = "endSprint",
    StartSprint = "startSprint",
    DeleteSprint = "deleteSprint",
}

export interface IOutgoingBlockUpdatePacket {
    customId: string;
    isNew?: boolean;
    isUpdate?: boolean;
    isDelete?: boolean;
    block?: Partial<IPublicBlock>;
}

export interface IOutgoingNewNotificationsPacket {
    notifications: IPublicNotificationData[];
}

export interface IOutgoingUserUpdatePacket {
    notificationsLastCheckedAt: string;
}

export interface IOutgoingUpdateNotificationsPacket {
    notifications: Array<{
        customId: string;
        data: Partial<IPublicNotificationData>;
    }>;
}

export interface IOutgoingCollaborationRequestResponsePacket {
    customId: string;
    response: CollaborationRequestResponse;
    org?: IPublicBlock;
}

export interface IOutgoingNewRoomPacket {
    room: IPublicRoomData;
}

export interface IOutgoingSendMessagePacket {
    chat: IPublicChatData;
}

export interface IOutgoingUpdateRoomReadCounterPacket {
    roomId: string;
    member: {
        userId: string;
        readCounter: string;
    };
}

export interface IOutgoingNewSprintPacket {
    sprint: IPublicSprint;
}

export interface IOutgoingUpdateSprintPacket {
    sprintId: string;
    data: {
        name?: string;
        duration?: SprintDuration;
        updatedAt: string;
        updatedBy: string;
    };
}

export interface IOutgoingEndSprintPacket {
    sprintId: string;
    endedAt: string;
    endedBy: string;
}

export interface IOutgoingStartSprintPacket {
    sprintId: string;
    startedAt: string;
    startedBy: string;
}

export interface IOutgoingDeleteSprintPacket {
    sprintId: string;
}
