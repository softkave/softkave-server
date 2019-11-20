import Joi from "joi";
import { pick } from "lodash";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import { IBlock } from "../../mongo/block";
import BlockModel from "../../mongo/block/BlockModel";
import { validate } from "../../utils/joi-utils";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { CRUDActionsMap } from "./actions";
import { IBlockDocument } from "./block";
import transferBlock from "./transferBlock";
import { getImmediateParentID, hasBlockParentsChanged } from "./utils";
import { blockJoiSchema } from "./validation";

// TODO: define all any types
interface IUpdateBlockInput {
  name: string;
  description: string;
  expectedEndAt: number;
  color: string;
  priority: string;
  isBacklog: boolean;
  taskCollaborators: Array<{
    userId: string;
    completedAt: number;
    assignedBy: string;
    assignedAt: number;
  }>;
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
  subTasks: Array<{
    customId: string;
    description: string;
  }>;
}

const permittedUpdatesInUpdateBlock = [
  "name",
  "description",
  "expectedEndAt",
  "color",
  "priority",
  "isBacklog",
  "taskCollaborators",
  "groups",
  "projects",
  "tasks",
  "groupTaskContext",
  "groupProjectContext",
  "linkedBlocks"
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
    ...result.data,
    updatedAt: Date.now()
  };

  await blockModel.model.updateOne(
    {
      customId: block.customId
    },
    pick(update, permittedUpdatesInUpdateBlock)
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
