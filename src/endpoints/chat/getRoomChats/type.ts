import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {IPublicChat} from '../types';

export interface IGetRoomChatsEndpointParams {
  roomId: string;
}

export interface IGetRoomChatsEndpointResult {
  chats: IPublicChat[];
}

export type GetRoomChatsEndpoint = Endpoint<
  IBaseContext,
  IGetRoomChatsEndpointParams,
  IGetRoomChatsEndpointResult
>;
