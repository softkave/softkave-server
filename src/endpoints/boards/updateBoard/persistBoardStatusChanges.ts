import {IBoard, IBoardStatus} from '../../../mongo/block/board';
import {IUser} from '../../../mongo/user/definitions';
import {indexArray} from '../../../utilities/fns';
import RequestData from '../../RequestData';
import {fireAndForgetPromise} from '../../utils';
import {IUpdateBoardContext, IUpdateBoardParameters} from './types';

function getStatusChangedFields(s1: IBoardStatus, s2: IBoardStatus): Array<keyof IBoardStatus> {
  return ['color', 'description', 'name', 'position'].reduce((accumulator, field) => {
    const f = field as keyof IBoardStatus;
    if (s1[f] !== s2[f]) {
      accumulator.push(f);
    }

    return accumulator;
  }, [] as Array<keyof IBoardStatus>);
}

async function persistBoardStatusChanges(
  context: IUpdateBoardContext,
  instData: RequestData<IUpdateBoardParameters>,
  board: IBoard,
  data: Partial<IBoard>,
  user: IUser
) {
  const boardStatuses = data.boardStatuses;
  if (!boardStatuses) {
    return;
  }

  const oldBoardStatuses = board.boardStatuses || [];
  const indexedOldBoardStatuses = indexArray(oldBoardStatuses, {
    path: 'customId',
  });

  const indexedNewBoardStatuses = indexArray(boardStatuses, {
    path: 'customId',
  });

  const deletedStatusIdsWithReplacement: Array<{
    oldId: string;
    newId: string;
  }> = [];

  oldBoardStatuses.forEach((status, index) => {
    if (!indexedNewBoardStatuses[status.customId]) {
      const newIdIndex = index >= boardStatuses.length ? index - 1 : index;
      const newId = boardStatuses[newIdIndex]?.customId;
      deletedStatusIdsWithReplacement.push({
        newId,
        oldId: status.customId,
      });
    }
  });

  boardStatuses.forEach(status => {
    const existingStatus = indexedOldBoardStatuses[status.customId];
    if (!existingStatus) {
      return;
    }

    if (existingStatus.updatedAt !== status.updatedAt) {
      const changedFields = getStatusChangedFields(existingStatus, status);
      const newValue: any = {};
      const oldValue: any = {};
      if (changedFields.length === 0) {
        return;
      }

      changedFields.forEach(field => {
        oldValue[field] = existingStatus[field];
        newValue[field] = status[field];
      });
    }
  });

  if (deletedStatusIdsWithReplacement.length === 0) {
    return;
  }

  // TODO: how should we handle if this fails?
  // if it fails, the status will be incorrect, maybe change in client-side
  // TODO: maybe wite a cron job to clean things up
  fireAndForgetPromise(
    context.bulkUpdateDeletedStatusInTasks(
      context,
      board.customId,
      deletedStatusIdsWithReplacement,
      user
    )
  );
}

export default persistBoardStatusChanges;
