import { CollaborationRequestResponse } from "../../mongo/collaboration-request/definitions";
import { SprintDuration } from "../../mongo/sprint";
import { IPublicPermissionGroup } from "../accessControl/types";
import { IPublicBlock } from "../block/types";
import { IPublicChatData, IPublicRoomData } from "../chat/types";
import { IPublicCollaborationRequest } from "../collaborationRequest/types";
import { IPublicSprint } from "../sprints/types";

export enum OutgoingSocketEvents {
    BlockUpdate = "blockUpdate",
    OrganizationNewCollaborationRequests = "organizationNewCollaborationRequests",
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
    UpdateBlockPermissionGroups = "updateBlockPermissionGroups",
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
    organization?: IPublicBlock;
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

export interface IOutgoingUpdateBlockPermissionGroupsPacket {
    blockId: string;
    add?: IPublicPermissionGroup[];
    update?: Array<{
        id: string;
        data: Partial<IPublicPermissionGroup>;
    }>;
    remove?: string[];
}
