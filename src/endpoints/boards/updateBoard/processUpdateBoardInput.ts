import { IBoard } from '../../../mongo/block/board';
import { IBoardSprintOptions, SprintDuration } from '../../../mongo/sprint/definitions';
import { IUser } from '../../../mongo/user/definitions';
import { getDate, mergeData } from '../../../utilities/fns';
import { ExtractFieldsDefaultScalarTypes, IUpdateComplexTypeArrayInput } from '../../types';
import { extractFields, getFields } from '../../utils';
import { IBoardLabelInput, IBoardStatusInput, IBoardStatusResolutionInput } from '../types';
import { IUpdateBoardInput } from './types';
import { mergeLabelUpdates, mergeResolutionUpdates, mergeStatusUpdates } from './utils';

interface IUpdateBoardExtractFieldsExtraArgs {
  user: IUser;
  board: IBoard;
}

const fields = getFields<
  IUpdateBoardInput,
  ExtractFieldsDefaultScalarTypes | IUpdateComplexTypeArrayInput<any>,
  IUpdateBoardExtractFieldsExtraArgs,
  Partial<IBoard>
>({
  name: true,
  description: true,
  color: true,
  visibility: true,
  boardStatuses: (
    data: IUpdateComplexTypeArrayInput<IBoardStatusInput>,
    args: IUpdateBoardExtractFieldsExtraArgs
  ) => {
    return mergeStatusUpdates(args.board, data, args.user);
  },
  boardLabels: (
    data: IUpdateComplexTypeArrayInput<IBoardLabelInput>,
    args: IUpdateBoardExtractFieldsExtraArgs
  ) => {
    return mergeLabelUpdates(args.board, data, args.user);
  },
  boardResolutions: (
    data: IUpdateComplexTypeArrayInput<IBoardStatusResolutionInput>,
    args: IUpdateBoardExtractFieldsExtraArgs
  ) => {
    return mergeResolutionUpdates(args.board, data, args.user);
  },
  sprintOptions: (
    data: Required<IUpdateBoardInput>['sprintOptions'],
    args: IUpdateBoardExtractFieldsExtraArgs
  ) => {
    const sprintOptionsUpdate: Partial<IBoardSprintOptions> = {
      ...data,
      updatedAt: getDate(),
      updatedBy: args.user.customId,
    };

    if (args.board.sprintOptions) {
      return mergeData( sprintOptionsUpdate, args.board.sprintOptions, {arrayUpdateStrategy: "replace"});
    } else {
      const newOptions: IBoardSprintOptions = {
        duration: data.duration || SprintDuration.TwoWeeks,
        createdAt: getDate(),
        createdBy: args.user.customId,
      };

      return mergeData( newOptions, sprintOptionsUpdate, {arrayUpdateStrategy: "replace"});
    }
  },
});

export default function processUpdateBoardInput(
  block: IBoard,
  data: IUpdateBoardInput,
  user: IUser
): Partial<IBoard> {
  const update = extractFields(data, fields, {
    board: block,
    user,
  });

  update.lastUpdatedBy = user.customId;
  update.lastUpdatedAt = getDate();
  return update;
}
