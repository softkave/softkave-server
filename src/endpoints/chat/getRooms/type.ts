import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {IPublicChatRoom} from '../types';

export interface IGetRoomsEndpointParams {
  orgId: string;
}

export interface IGetRoomsEndpointResult {
  rooms: IPublicChatRoom[];
}

export type GetRoomsEndpoint = Endpoint<
  IBaseContext,
  IGetRoomsEndpointParams,
  IGetRoomsEndpointResult
>;
