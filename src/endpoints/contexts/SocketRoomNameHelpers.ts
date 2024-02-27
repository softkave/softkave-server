import {SystemActionType, SystemResourceType} from '../../models/system';
import {getUserType} from '../../utilities/ids';

export default class SocketRoomNameHelpers {
  static getUserRoomName = (resourceId: string) => {
    return `${getUserType(resourceId)}/${resourceId}`;
  };

  static getClientRoomName = (resourceId: string) => {
    return `${SystemResourceType.Client}/${resourceId}`;
  };

  static getOrganizationRoomName = (
    resourceId: string,
    action: SystemActionType = SystemActionType.Read
  ) => {
    return `${SystemResourceType.Workspace}/${resourceId}/${action}`;
  };

  static getBoardRoomName = (resourceId: string) => {
    return `${SystemResourceType.Board}/${resourceId}`;
  };

  static getBoardTasksRoomName = (resourceId: string) => {
    return `${this.getBoardRoomName(resourceId)}/${SystemResourceType.Task}`;
  };

  static getBoardSprintsRoomName = (resourceId: string) => {
    return `${this.getBoardRoomName(resourceId)}/${SystemResourceType.Sprint}`;
  };

  static getChatRoomName = (roomId: string) => {
    // using '-' cause existing chat rooms use it and
    // we don't want to break them.
    return `${SystemResourceType.ChatRoom}-${roomId}`;
  };
}
