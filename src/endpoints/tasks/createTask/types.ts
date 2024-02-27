import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {INewTaskInput, IPublicTask} from '../types';

export interface ICreateTaskParameters {
  task: INewTaskInput;
}

export interface ICreateTaskResult {
  task: IPublicTask;
}

export type CreateTaskEndpoint = Endpoint<IBaseContext, ICreateTaskParameters, ICreateTaskResult>;
