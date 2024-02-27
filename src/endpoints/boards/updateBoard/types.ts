import {ResourceVisibility} from '../../../models/resource';
import {SprintDuration} from '../../../mongo/sprint/definitions';
import {IUser} from '../../../mongo/user/definitions';
import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint, IUpdateComplexTypeArrayInput} from '../../types';
import {
  IBoardLabelInput,
  IBoardStatusInput,
  IBoardStatusResolutionInput,
  IPublicBoard,
} from '../types';

export interface IUpdateBoardInput {
  name?: string;
  description?: string;
  color?: string;
  boardStatuses?: IUpdateComplexTypeArrayInput<IBoardStatusInput>;
  boardLabels?: IUpdateComplexTypeArrayInput<IBoardLabelInput>;
  boardResolutions?: IUpdateComplexTypeArrayInput<IBoardStatusResolutionInput>;
  sprintOptions?: {
    duration: SprintDuration;
  };
  visibility?: ResourceVisibility;
}

export interface IUpdateBoardParameters {
  boardId: string;
  data: IUpdateBoardInput;
}

export interface IUpdateBoardContext extends IBaseContext {
  bulkUpdateDeletedStatusInTasks: (
    ctx: IBaseContext,
    boardId: string,
    items: Array<{oldId: string; newId: string}>,
    user: IUser
  ) => Promise<void>;
  bulkUpdateDeletedResolutionsInTasks: (
    ctx: IBaseContext,
    boardId: string,
    ids: string[]
  ) => Promise<void>;
  bulkRemoveDeletedLabelsInTasks: (
    ctx: IBaseContext,
    boardId: string,
    ids: string[]
  ) => Promise<void>;
}

export type UpdateBoardEndpoint = Endpoint<
  IUpdateBoardContext,
  IUpdateBoardParameters,
  {board: IPublicBoard}
>;
