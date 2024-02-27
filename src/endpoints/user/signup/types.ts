import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {ILoginResult} from '../login/types';

export interface INewUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  color: string;
}

export interface ISignupArgData {
  user: INewUserInput;
}

export type SignupEndpoint = Endpoint<IBaseContext, ISignupArgData, ILoginResult>;
