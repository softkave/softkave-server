import Joi from "joi";
import { pick } from "lodash";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import {
  IBlock,
  IBlockDocument,
  ISubTask,
  ITaskCollaborationData,
  ITaskCollaborator
} from "../../mongo/block";
import BlockModel from "../../mongo/block/BlockModel";
import { validate } from "../../utils/joi-utils";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { CRUDActionsMap } from "./actions";
import transferBlock from "./transferBlock";
import { getImmediateParentID, hasBlockParentsChanged } from "./utils";
import { blockJoiSchema } from "./validation";

// TODO: move type to a type file
interface IUpdateBlockInput {
  name: string;
  description: string;
  expectedEndAt: number;
  color: string;
  priority: string;
  isBacklog: boolean;
  taskCollaborationData: ITaskCollaborationData;
  taskCollaborators: ITaskCollaborator[];
  parents: string[];
  groups: string[];
  projects: string[];
  tasks: string[];
  groupTaskContext: string[];
  groupProjectContext: string[];
  linkedBlocks: Array<{
    blockId: string;
    reason: string;
    createdBy: string;
    createdAt: number;
  }>;
  subTasks: ISubTask[];
}

const permittedUpdatesInUpdateBlock = [
  "name",
  "description",
  "expectedEndAt",
  "color",
  "priority",
  "isBacklog",
  "taskCollaborationData",
  "taskCollaborators",
  "groups",
  "projects",
  "tasks",
  "groupTaskContext",
  "groupProjectContext",
  "linkedBlocks",
  "subTasks"
];

export interface IUpdateBlockParameters {
  block: IBlockDocument;
  data: IUpdateBlockInput;
  blockModel: BlockModel;
  accessControlModel: AccessControlModel;
  user: IUserDocument;
}

const updateBlockJoiSchema = Joi.object().keys({
  data: blockJoiSchema
});

async function updateBlock({
  block,
  data,
  blockModel,
  accessControlModel,
  user
}: IUpdateBlockParameters) {
  const result = validate({ data }, updateBlockJoiSchema);
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    CRUDActionName: CRUDActionsMap.UPDATE
  });

  const update: Partial<IBlock> = {
    ...pick(result.data, permittedUpdatesInUpdateBlock),
    updatedAt: Date.now()
  };

  const subTasks = block.subTasks;
  const now = Date.now();

  if (Array.isArray(subTasks) && subTasks.length > 0) {
    const areSubTasksCompleted = !!!subTasks.find(
      subTask => !!!subTask.completedAt
    );

    if (areSubTasksCompleted !== !!update.taskCollaborationData.completedAt) {
      update.taskCollaborationData = {
        ...update.taskCollaborationData,
        completedAt: areSubTasksCompleted ? now : null,
        completedBy: areSubTasksCompleted ? user.customId : null
      };
    }
  }

  await blockModel.model.updateOne(
    {
      customId: block.customId
    },
    update
  );

  if (hasBlockParentsChanged(block, update)) {
    await transferBlock({
      accessControlModel,
      user,
      blockModel,
      draggedBlock: block,
      sourceBlock: { customId: getImmediateParentID(block) },
      destinationBlock: { customId: getImmediateParentID(update as IBlock) },
      draggedBlockType: block.type
    });
  }
}

export default updateBlock;
