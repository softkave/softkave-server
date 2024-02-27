import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {ISubscribeParameters} from '../subscribe/types';

export interface IRoomState {
  lastBroadcastTimestamp: number;
}

export interface IGetRoomStateEndpointResult {
  rooms: IRoomState[];
}

export type GetRoomStateEndpoint = Endpoint<
  IBaseContext,
  ISubscribeParameters,
  IGetRoomStateEndpointResult
>;
