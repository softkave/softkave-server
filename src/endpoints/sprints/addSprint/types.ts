import {SprintDuration} from '../../../mongo/sprint/definitions';
import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {IPublicSprint} from '../types';

export interface IAddSprintParameters {
  boardId: string;
  data: {
    name: string;
    duration: SprintDuration;
  };
}

export type AddSprintEndpoint = Endpoint<
  IBaseContext,
  IAddSprintParameters,
  {sprint: IPublicSprint}
>;
