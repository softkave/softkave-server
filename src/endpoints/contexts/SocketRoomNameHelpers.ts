import { SystemResourceType } from "../../models/system";

export default class SocketRoomNameHelpers {
    getUserRoomName = (resourceId: string) => {
        return `${SystemResourceType.User}/${resourceId}`;
    };

    getClientRoomName = (resourceId: string) => {
        return `${SystemResourceType.Client}/${resourceId}`;
    };

    getOrganizationRoomName = (resourceId: string) => {
        return `${SystemResourceType.Organization}/${resourceId}`;
    };

    getBoardRoomName = (resourceId: string) => {
        return `${SystemResourceType.Board}/${resourceId}`;
    };

    getBoardTasksRoomName = (resourceId: string) => {
        return `${this.getBoardRoomName(resourceId)}/${
            SystemResourceType.Task
        }`;
    };

    getBoardSprintsRoomName = (resourceId: string) => {
        return `${this.getBoardRoomName(resourceId)}/${
            SystemResourceType.Sprint
        }`;
    };

    getChatRoomName = (member01: string, member02: string) => {
        return `${SystemResourceType.Chat}/${member01}--${member02}`;
    };
}
