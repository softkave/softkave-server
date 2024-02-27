import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';

export interface IDeleteBoardParameters {
  boardId: string;
}

export type DeleteBoardEndpoint = Endpoint<IBaseContext, IDeleteBoardParameters>;
