import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';

export interface ISprintExistsParameters {
  name: string;
  boardId: string;
}

export type SprintExistsEndpoint = Endpoint<
  IBaseContext,
  ISprintExistsParameters,
  {exists: boolean}
>;
