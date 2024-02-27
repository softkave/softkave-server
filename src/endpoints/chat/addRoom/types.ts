import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {IPublicChatRoom} from '../types';

export interface IAddRoomEndpointParameters {
  recipientId: string;
  orgId: string;
}

export interface IAddRoomEndpointResult {
  room: IPublicChatRoom;
}

export type AddRoomEndpoint = Endpoint<
  IBaseContext,
  IAddRoomEndpointParameters,
  IAddRoomEndpointResult
>;
