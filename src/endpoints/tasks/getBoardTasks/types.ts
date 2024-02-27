import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {IPublicTask} from '../types';

export interface IGetBoardTasksParameters {
  boardId: string;
}

export interface IGetBoardTasksResult {
  tasks: IPublicTask[];
}

export type GetBoardTasksEndpoint = Endpoint<
  IBaseContext,
  IGetBoardTasksParameters,
  IGetBoardTasksResult
>;
