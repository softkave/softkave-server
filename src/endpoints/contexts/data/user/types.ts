import {IUser} from '../../../../mongo/user/definitions';
import {DataQuery, IBaseDataProvider} from '../types';

export type IAnonymousUserQuery = DataQuery<IUser>;
export type IAnonymousUserDataProvider = IBaseDataProvider<IUser>;
export type IUserQuery = DataQuery<IUser>;
export type IUserDataProvider = IBaseDataProvider<IUser>;
