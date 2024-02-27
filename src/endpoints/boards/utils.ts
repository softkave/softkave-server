import {IBoard} from '../../mongo/block/board';
import {getDateString, getDateStringIfExists} from '../../utilities/fns';
import {extractFields, getFields, publicWorkspaceResourceFields} from '../utils';
import {BoardDoesNotExistError} from './errors';
import {IPublicBoard} from './types';

const publicBoardFields = getFields<IPublicBoard>({
  ...publicWorkspaceResourceFields,
  name: true,
  description: true,
  color: true,
  boardStatuses: {
    createdAt: getDateString,
    createdBy: true,
    customId: true,
    description: true,
    updatedAt: getDateStringIfExists,
    updatedBy: true,
    color: true,
    name: true,
    position: true,
  },
  boardLabels: {
    createdAt: getDateString,
    createdBy: true,
    customId: true,
    description: true,
    updatedAt: getDateStringIfExists,
    updatedBy: true,
    color: true,
    name: true,
  },
  boardResolutions: {
    createdAt: getDateString,
    createdBy: true,
    customId: true,
    description: true,
    updatedAt: getDateStringIfExists,
    updatedBy: true,
    name: true,
  },
  currentSprintId: true,
  sprintOptions: {
    createdAt: getDateString,
    createdBy: true,
    duration: true,
    updatedAt: getDateStringIfExists,
    updatedBy: true,
  },
  lastSprintId: true,
});

export function getPublicBoardData(board: Partial<IBoard>): IPublicBoard {
  return extractFields(board, publicBoardFields);
}

export function getPublicBoardsArray(boards: Array<Partial<IBoard>>): IPublicBoard[] {
  // @ts-ignore
  return boards.map(board => extractFields(board, publicBoardFields));
}

export function throwBoardNotFoundError() {
  throw new BoardDoesNotExistError();
}

export function assertBoard(board?: IBoard | null): asserts board {
  if (!board) {
    throwBoardNotFoundError();
  }
}
