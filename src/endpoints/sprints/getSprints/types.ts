import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {IPublicSprint} from '../types';

export interface IGetSprintsParameters {
  boardId: string;
}

export type GetSprintsEndpoint = Endpoint<
  IBaseContext,
  IGetSprintsParameters,
  {sprints: IPublicSprint[]}
>;
