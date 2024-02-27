import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {IPublicBoard} from '../types';

export interface IGetBoardParameters {
  boardId: string;
}

export type GetBoardEndpoint = Endpoint<IBaseContext, IGetBoardParameters, {board: IPublicBoard}>;
