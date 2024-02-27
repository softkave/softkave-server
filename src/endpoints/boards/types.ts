import {IWorkspaceResource, ResourceVisibility} from '../../models/resource';
import {IBoard} from '../../mongo/block/board';
import {ConvertDatesToStrings} from '../../utilities/types';
import {IResourceWithId} from '../types';

export interface IBoardStatusInput extends IResourceWithId {
  name: string;
  color: string;
  position: number;
  description?: string;
}

export interface IBoardLabelInput extends IResourceWithId {
  name: string;
  color: string;
  description?: string;
}

export interface IBoardStatusResolutionInput extends IResourceWithId {
  name: string;
  description?: string;
}

export interface INewBoardInput {
  name: string;
  description?: string;
  color: string;
  workspaceId: string;
  boardStatuses: IBoardStatusInput[];
  boardLabels: IBoardLabelInput[];
  boardResolutions: IBoardStatusResolutionInput[];
  visibility?: ResourceVisibility;
}

export type IPublicBoard = ConvertDatesToStrings<
  IWorkspaceResource &
    Pick<
      IBoard,
      | 'boardLabels'
      | 'boardResolutions'
      | 'boardStatuses'
      | 'color'
      | 'name'
      | 'description'
      | 'lastSprintId'
      | 'sprintOptions'
      | 'currentSprintId'
    >
>;
