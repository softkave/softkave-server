import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {IPublicChatRoom} from '../types';

export interface IUpdateRoomReadCounterParameters {
  orgId: string;
  roomId: string;
  readCounter?: number;
}

export interface IUpdateRoomReadCounterResult {
  readCounter: string;
  room: IPublicChatRoom;
}

export type UpdateRoomReadCounterEndpoint = Endpoint<
  IBaseContext,
  IUpdateRoomReadCounterParameters,
  IUpdateRoomReadCounterResult
>;
