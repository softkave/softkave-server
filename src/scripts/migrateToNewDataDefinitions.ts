import {
  blockAssignedLabelSchema,
  blockAssigneeSchema,
  blockLabelSchema,
  BlockPriority,
  blockStatusSchema,
  boardStatusResolutionSchema,
  getBlockModel,
  IBlock,
  subTaskSchema,
  taskSprintSchema,
} from "../mongo/block";
import { getDefaultConnection } from "../mongo/defaultConnection";
import MongoModel from "../mongo/MongoModel";
import { boardSprintOptionsSchema } from "../mongo/sprint";
import {
  logScriptFailed,
  logScriptStarted,
  logScriptSuccessful,
} from "./utils";
import { Document } from "mongoose";
import { getDate } from "../utilities/fns";
import {
  getCollaborationRequestModel,
  ICollaborationRequestDocument,
} from "../mongo/collaboration-request";
import collaborationRequestSchema from "../mongo/collaboration-request/definitions";
import { waitOnPromises } from "../utilities/waitOnPromises";

/**
 * Block
 * - Remove lowercasedName
 * - Move data to blocks-v4 from blocks-v3
 * - Change priority to 'high', 'medium', and 'low'
 * - Add defaults to field that should have defaults
 *
 * Collaboration Request
 * - Move data from collaborationRequests to collaboration-requests
 */

interface IOldBlock extends IBlock {
  lowerCasedName?: string;
}

type IOldBlockDocument = IOldBlock & Document;
export enum OldBlockPriority {
  Important = "important",
  NotImportant = "not important",
  VeryImportant = "very important",
}

const priorityChangeMap: Record<OldBlockPriority, BlockPriority> = {
  [OldBlockPriority.VeryImportant]: BlockPriority.High,
  [OldBlockPriority.Important]: BlockPriority.Medium,
  [OldBlockPriority.NotImportant]: BlockPriority.Low,
};

const connection = getDefaultConnection().getConnection();

async function getBlockModels() {
  const newBlockModel = getBlockModel();
  const oldBlockModel = new MongoModel<IOldBlockDocument>({
    modelName: "block-v3",
    collectionName: "blocks-v3",
    rawSchema: {
      customId: { type: String, unique: true, index: true },
      name: { type: String },
      lowerCasedName: { type: String, index: true },
      description: { type: String },
      createdAt: { type: Date, default: () => getDate() },
      createdBy: { type: String },
      updatedAt: { type: Date },
      updatedBy: { type: String },
      type: { type: String, index: true },
      parent: { type: String, index: true },
      rootBlockId: { type: String },
      isDeleted: { type: Boolean, default: false, index: true },
      deletedAt: { type: Date },
      deletedBy: { type: String },
      permissionResourceId: { type: String },
      color: { type: String },
      publicPermissionGroupId: { type: String },
      assignees: { type: [blockAssigneeSchema] },
      priority: { type: String },
      subTasks: { type: [subTaskSchema] },
      dueAt: { type: Date },
      status: { type: String },
      statusAssignedBy: { type: String },
      statusAssignedAt: { type: Date },
      taskResolution: { type: String },
      labels: { type: [blockAssignedLabelSchema] },
      taskSprint: { type: taskSprintSchema },
      boardStatuses: { type: [blockStatusSchema] },
      boardLabels: { type: [blockLabelSchema] },
      boardResolutions: { type: boardStatusResolutionSchema },
      currentSprintId: { type: String },
      sprintOptions: { type: boardSprintOptionsSchema },
      lastSprintId: { type: String },
    },
    connection: connection,
  });

  oldBlockModel.waitTillReady();
  newBlockModel.waitTillReady();
  return { oldBlockModel, newBlockModel };
}

async function getCollaborationRequestModels() {
  const newRequestModel = getCollaborationRequestModel();
  const oldRequestModel = new MongoModel<ICollaborationRequestDocument>({
    modelName: "collaborationRequest",
    collectionName: "collaborationRequests",
    rawSchema: collaborationRequestSchema,
    connection: connection,
  });

  oldRequestModel.waitTillReady();
  newRequestModel.waitTillReady();
  return { oldRequestModel, newRequestModel };
}

async function moveBlocks() {
  try {
    const { newBlockModel, oldBlockModel } = await getBlockModels();
    const oldBlocks = await oldBlockModel.model.find({}).exec();
    const newBlocks: IBlock[] = oldBlocks.map((item) => {
      const block: IBlock = {
        ...item,
        priority: priorityChangeMap[item.priority],
        assignees: item.assignees || [],
        subTasks: item.subTasks || [],
        labels: item.labels || [],
        boardLabels: item.boardLabels || [],
        boardResolutions: item.boardResolutions || [],
        boardStatuses: item.boardStatuses || [],
      };

      return block;
    });

    await newBlockModel.model.insertMany(newBlocks);
    console.log(`Moved ${newBlocks.length} blocks`);
  } catch (error) {
    console.error(error);
  }
}

async function moveRequests() {
  try {
    const { newRequestModel, oldRequestModel } =
      await getCollaborationRequestModels();
    const requests = await oldRequestModel.model.find({}).exec();
    await newRequestModel.model.insertMany(requests);
    console.log(`Moved ${requests.length} collaboration requests`);
  } catch (error) {
    console.error(error);
  }
}

export async function script_MigrateToNewDataDefinitions() {
  logScriptStarted(script_MigrateToNewDataDefinitions);

  try {
    await waitOnPromises([moveBlocks(), moveRequests()]);
    logScriptSuccessful(script_MigrateToNewDataDefinitions);
  } catch (error) {
    logScriptFailed(script_MigrateToNewDataDefinitions, error);
  }
}
