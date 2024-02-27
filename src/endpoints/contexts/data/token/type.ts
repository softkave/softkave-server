import {IToken} from '../../../../mongo/token/definitions';
import {DataQuery, IBaseDataProvider} from '../types';

export type ITokenQuery = DataQuery<IToken>;
export type ITokenDataProvider = IBaseDataProvider<IToken>;
