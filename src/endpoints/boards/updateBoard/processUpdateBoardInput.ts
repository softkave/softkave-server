import { merge } from "lodash";
import { IBoardSprintOptions, SprintDuration } from "../../../mongo/sprint";
import { IUser } from "../../../mongo/user";
import { getDate } from "../../../utilities/fns";
import {
  ExtractFieldsDefaultScalarTypes,
  IUpdateComplexTypeArrayInput,
} from "../../types";
import { extractFields, getFields } from "../../utils";
import { IBlockStatusInput, IBoard } from "../types";
import { IUpdateBoardInput } from "./types";
import {
  mergeLabelUpdates,
  mergeResolutionUpdates,
  mergeStatusUpdates,
} from "./utils";

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
  boardStatuses: (
    data: IUpdateComplexTypeArrayInput<IBlockStatusInput>,
    args: IUpdateBoardExtractFieldsExtraArgs
  ) => {
    return mergeStatusUpdates(args.board, data, args.user);
  },
  boardLabels: (
    data: IUpdateComplexTypeArrayInput<IBlockStatusInput>,
    args: IUpdateBoardExtractFieldsExtraArgs
  ) => {
    return mergeLabelUpdates(args.board, data, args.user);
  },
  boardResolutions: (
    data: IUpdateComplexTypeArrayInput<IBlockStatusInput>,
    args: IUpdateBoardExtractFieldsExtraArgs
  ) => {
    return mergeResolutionUpdates(args.board, data, args.user);
  },
  sprintOptions: (
    data: IUpdateBoardInput["sprintOptions"],
    args: IUpdateBoardExtractFieldsExtraArgs
  ) => {
    const sprintOptionsUpdate: Partial<IBoardSprintOptions> = {
      ...data,
      updatedAt: getDate(),
      updatedBy: args.user.customId,
    };

    if (args.board.sprintOptions) {
      return merge({}, sprintOptionsUpdate, args.board.sprintOptions);
    } else {
      const newOptions: IBoardSprintOptions = {
        duration: data.duration || SprintDuration.TwoWeeks,
        createdAt: getDate(),
        createdBy: args.user.customId,
      };

      return merge({}, newOptions, sprintOptionsUpdate);
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

  update.updatedBy = user.customId;
  update.updatedAt = getDate();
  return update;
}
