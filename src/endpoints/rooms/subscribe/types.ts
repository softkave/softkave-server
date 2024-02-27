import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {IRoomOpInput} from '../types';

export interface ISubscribeParameters {
  rooms: IRoomOpInput[];
}

export type SubscribeEndpoint = Endpoint<IBaseContext, ISubscribeParameters>;
