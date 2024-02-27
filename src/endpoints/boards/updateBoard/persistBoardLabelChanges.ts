import {IBoard, IBoardLabel} from '../../../mongo/block/board';
import {indexArray} from '../../../utilities/fns';
import RequestData from '../../RequestData';
import {fireAndForgetPromise} from '../../utils';
import {IUpdateBoardContext, IUpdateBoardParameters} from './types';

function getLabelChangedFields(label1: IBoardLabel, label2: IBoardLabel): Array<keyof IBoardLabel> {
  return ['color', 'description', 'name'].reduce((accumulator, field) => {
    const f = field as keyof IBoardLabel;
    if (label1[f] !== label2[f]) {
      accumulator.push(f);
    }

    return accumulator;
  }, [] as Array<keyof IBoardLabel>);
}

async function persistBoardLabelChanges(
  context: IUpdateBoardContext,
  instData: RequestData<IUpdateBoardParameters>,
  board: IBoard,
  data: Partial<IBoard>
) {
  const boardLabels = data.boardLabels;
  if (!boardLabels) {
    return;
  }

  const oldBoardLabels = board.boardLabels || [];
  const indexedOldBoardLabels = indexArray(oldBoardLabels, {
    path: 'customId',
  });

  const indexedNewBoardLabels = indexArray(boardLabels, {
    path: 'customId',
  });

  const deletedLabelIds: string[] = [];
  oldBoardLabels.forEach(label => {
    if (!indexedNewBoardLabels[label.customId]) {
      deletedLabelIds.push(label.customId);
    }
  });

  boardLabels.forEach(label => {
    const existingLabel = indexedOldBoardLabels[label.customId];
    if (!existingLabel) {
      return;
    }

    if (existingLabel.updatedAt !== label.updatedAt) {
      const changedFields = getLabelChangedFields(existingLabel, label);
      const newValue: any = {};
      const oldValue: any = {};
      if (changedFields.length === 0) {
        return;
      }

      changedFields.forEach(field => {
        oldValue[field] = existingLabel[field];
        newValue[field] = label[field];
      });
    }
  });

  if (deletedLabelIds.length === 0) {
    return;
  }

  // TODO: how should we handle if this fails?
  // if it fails, the task will contain labels that have been deleted, maybe change in client-side
  // TODO: maybe wite a cron job to clean things up
  fireAndForgetPromise(
    context.bulkRemoveDeletedLabelsInTasks(context, board.customId, deletedLabelIds)
  );
}

export default persistBoardLabelChanges;
