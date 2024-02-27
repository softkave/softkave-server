import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';

export interface IGetAverageTimeToCompleteTasksParameters {
  boardId: string;
}

export interface IGetAverageTimeToCompleteTasksResult {
  avg: number;
}

export type GetAverageTimeToCompleteTasksEndpoint = Endpoint<
  IBaseContext,
  IGetAverageTimeToCompleteTasksParameters,
  IGetAverageTimeToCompleteTasksResult
>;
