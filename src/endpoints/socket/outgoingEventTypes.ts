import { CollaborationRequestResponse } from "../../mongo/collaborationRequest/definitions";
import { SprintDuration } from "../../mongo/sprint";
import { IPublicRoleData } from "../access-control/types";
import { IPublicBlock } from "../block/types";
import { IPublicChatData, IPublicRoomData } from "../chat/types";
import { IPublicCollaborationRequest } from "../notifications/types";
import { IPublicSprint } from "../sprints/types";

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

    MarkNotificationsRead = "markNotificationsRead",
    UpdateBlockRoles = "updateBlockRoles",
    UpdateUserRoles = "updateUserRoles",
}

export interface IOutgoingBlockUpdatePacket {
    customId: string;
    isNew?: boolean;
    isUpdate?: boolean;
    isDelete?: boolean;
    block?: Partial<IPublicBlock>;
}

export interface IOutgoingNewCollaborationRequestsPacket {
    requests: IPublicCollaborationRequest[];
}

export interface IOutgoingUserUpdatePacket {
    notificationsLastCheckedAt: string;
}

export interface IOutgoingUpdateCollaborationRequestsPacket {
    requests: Array<{
        id: string;
        data: Partial<IPublicCollaborationRequest>;
    }>;
}

export interface IOutgoingMarkNotificationsReadPacket {
    notifications: Array<{ customId: string; readAt: string }>;
}

export interface IOutgoingCollaborationRequestResponsePacket {
    customId: string;
    response: CollaborationRequestResponse;
    respondedAt: string;
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

export interface IOutgoingUpdateBlockRolesPacket {
    blockId: string;
    add?: IPublicRoleData[];
    update?: Array<{
        id: string;
        data: Partial<IPublicRoleData>;
    }>;
    remove?: string[];
}
