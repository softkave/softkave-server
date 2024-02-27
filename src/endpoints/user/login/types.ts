import {IPublicClient} from '../../clients/types';
import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {IPublicUserData} from '../types';

export interface ILoginParameters {
  email: string;
  password: string;
}

export interface ILoginResult {
  user: IPublicUserData;
  token: string;
  client: IPublicClient;
}

export type LoginEndpoint = Endpoint<IBaseContext, ILoginParameters, ILoginResult>;
