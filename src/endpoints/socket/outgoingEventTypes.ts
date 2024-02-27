import {SystemActionType, SystemResourceType} from '../../models/system';

export enum OutgoingSocketEvents {
  ResourceUpdate = 'ResourceUpdate',
}

export interface IOutgoingResourceUpdatePacket<T = any> {
  actionType: SystemActionType;
  resourceType: SystemResourceType;
  resource: T;
}

// What's actually sent to the client:
export interface IOutgoingResourceUpdatePacket02<T = any> extends IOutgoingResourceUpdatePacket<T> {
  roomName: string;
}
