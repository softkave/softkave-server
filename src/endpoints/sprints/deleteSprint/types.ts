import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';

export interface IDeleteSprintParameters {
  sprintId: string;
}

export type DeleteSprintEndpoint = Endpoint<IBaseContext, IDeleteSprintParameters>;
