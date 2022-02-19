import { SystemResourceType } from "../../models/system";

export default class SocketRoomNameHelpers {
    static getUserRoomName = (resourceId: string) => {
        return `${SystemResourceType.User}/${resourceId}`;
    };

    static getClientRoomName = (resourceId: string) => {
        return `${SystemResourceType.Client}/${resourceId}`;
    };

    static getOrganizationRoomName = (resourceId: string) => {
        return `${SystemResourceType.Organization}/${resourceId}`;
    };

    static getBoardRoomName = (resourceId: string) => {
        return `${SystemResourceType.Board}/${resourceId}`;
    };

    static getBoardTasksRoomName = (resourceId: string) => {
        return `${this.getBoardRoomName(resourceId)}/${
            SystemResourceType.Task
        }`;
    };

    static getBoardSprintsRoomName = (resourceId: string) => {
        return `${this.getBoardRoomName(resourceId)}/${
            SystemResourceType.Sprint
        }`;
    };

    static getChatRoomName = (roomId: string) => {
        // using '-' cause existing chat rooms use it and
        // we don't want to break them.
        return `${SystemResourceType.Room}-${roomId}`;
    };
}
