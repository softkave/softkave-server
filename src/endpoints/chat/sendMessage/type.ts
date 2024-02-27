import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {IPublicChat} from '../types';

export interface ISendMessageParameters {
  orgId: string;
  message: string;
  roomId: string;
  localId?: string;
}

export interface ISendMessageEndpointResult {
  chat: IPublicChat;
}

export type SendMessageEndpoint = Endpoint<
  IBaseContext,
  ISendMessageParameters,
  ISendMessageEndpointResult
>;
