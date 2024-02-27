import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';

export interface IBoardExistsParameters {
  name: string;
  parent: string;
}

export type BoardExistsEndpoint = Endpoint<IBaseContext, IBoardExistsParameters, {exists: boolean}>;
