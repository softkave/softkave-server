import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {ILoginResult} from '../login/types';

export type NewAnonymousUserEndpoint = Endpoint<IBaseContext, undefined, ILoginResult>;
