import Joi from "joi";
import { BlockType, IBlockLabel, IBlockStatus } from "../../mongo/block";
import { regEx, validationSchemas } from "../../utilities/validationUtils";
import { blockConstants } from "./constants";

const taskCollaboratorSchema = Joi.object().keys({
  userId: validationSchemas.uuid,
  assignedBy: validationSchemas.uuid,
  assignedAt: Joi.number(),

  // Allow null because sometimes, the value from the API or in DB is null,
  // and it leads to a false validation error
  completedAt: Joi.number().allow(null),
});

const taskCollaboratorsListSchema = Joi.array()
  .min(blockConstants.minTaskCollaboratorsLength)
  .max(blockConstants.maxTaskCollaboratorsLength)
  .unique("userId")
  .items(taskCollaboratorSchema);

const userUpdateableTypes = ["group", "org", "project", "task"] as BlockType[];
const userUpdateableblockTypeSchema = Joi.string()
  .lowercase()
  .valid(userUpdateableTypes);

const fullBlockTypes = [...userUpdateableTypes, "root"] as BlockType[];
const fullBlockTypeSchema = Joi.string().lowercase().valid(fullBlockTypes);

const blockChildrenIDList = Joi.array()
  .items(validationSchemas.uuid)
  .unique()
  .max(blockConstants.maxChildrenCount);

const subTasksSchema = Joi.object().keys({
  customId: Joi.string().uuid().required(),
  description: Joi.string()
    .min(blockConstants.minDescriptionLength)
    .max(blockConstants.maxDescriptionLength)
    .trim()
    .required(),
  completedBy: Joi.string().uuid(),
  completedAt: Joi.number(),
});

const taskCollaborationDataSchema = Joi.object().keys({
  collaborationType: Joi.string()
    .lowercase()
    .valid(blockConstants.taskCollaborationData),
  completedAt: Joi.number().allow(null),
  completedBy: Joi.string().uuid().allow(null),
});

const labelSchema = Joi.object().keys({
  customId: Joi.string().uuid().required(),
  name: Joi.string()
    .lowercase()
    .min(blockConstants.minLabelNameLength)
    .max(blockConstants.maxLabelNameLength)
    .required(),
  description: Joi.string()
    .max(blockConstants.maxLabelDescriptionLength)
    .allow(null),
  color: Joi.string().trim().lowercase().regex(regEx.hexColorPattern),
  createdAt: Joi.number().allow(null),
  createdBy: Joi.string().uuid().allow("system", null),
  updatedAt: Joi.number().allow(null),
  updatedBy: Joi.string().uuid().allow("system", null),
});

const statusSchema = Joi.object().keys({
  customId: Joi.string().uuid().required(),
  name: Joi.string()
    .lowercase()
    .min(blockConstants.minLabelNameLength)
    .max(blockConstants.maxLabelNameLength)
    .required(),
  description: Joi.string()
    .max(blockConstants.maxLabelDescriptionLength)
    .allow(null),
  createdAt: Joi.number().allow(null),
  createdBy: Joi.string().uuid().allow("system", null),
  updatedAt: Joi.number().allow(null),

  // TODO: allowing "system" allows boycotting the real data which can be exploited
  updatedBy: Joi.string().uuid().allow("system", null),
});

const statusListSchema = Joi.array()
  .max(blockConstants.maxAvailableLabels)
  .items(statusSchema)
  .unique((a: IBlockStatus, b: IBlockStatus) => {
    return a.customId === b.customId || a.name === b.name;
  });

const LabelListSchema = Joi.array()
  .max(blockConstants.maxAvailableLabels)
  .items(labelSchema)
  .unique((a: IBlockLabel, b: IBlockLabel) => {
    return a.customId === b.customId || a.name === b.name;
  });

const blockTypesSchema = Joi.array()
  .max(blockConstants.blockTypesArray.length)
  .unique()
  .items(userUpdateableblockTypeSchema);

const blockID = validationSchemas.uuid;
const name = Joi.string()
  .trim()
  .min(blockConstants.minNameLength)
  .max(blockConstants.maxNameLength);

const lowerCasedName = name.lowercase();

const description = Joi.string()
  .min(blockConstants.minDescriptionLength)
  .max(blockConstants.maxDescriptionLength)
  .trim()
  .when("type", {
    is: "task",
    then: Joi.required(),
  });

const updateDescription = Joi.string()
  .min(blockConstants.minDescriptionLength)
  .max(blockConstants.maxDescriptionLength)
  .trim();

const expectedEndAt = Joi.number();
const createdAt = Joi.number();
const color = Joi.string().trim().lowercase().regex(regEx.hexColorPattern);

const updatedAt = Joi.number();
const parent = validationSchemas.uuid.when("type", {
  is: Joi.string().valid(["group", "project", "task"] as BlockType[]),
  then: Joi.required(),
});

const rootBlockID = parent;

const createdBy = validationSchemas.uuid;
const taskCollaborationData = taskCollaborationDataSchema;
const taskCollaborators = taskCollaboratorsListSchema;
const priority = Joi.string()
  .lowercase()
  .valid(blockConstants.priorityValuesArray);

const tasks = blockChildrenIDList;
const groups = blockChildrenIDList;
const projects = blockChildrenIDList;
const subTasks = Joi.array()
  .items(subTasksSchema)
  .min(blockConstants.minSubTasksLength)
  .max(blockConstants.maxSubTasksLength);

export const groupContext = Joi.string()
  .lowercase()
  .valid(blockConstants.groupContextsArray);

const newBlock = Joi.object().keys({
  name,
  description,
  expectedEndAt,
  color,
  parent,
  rootBlockID,
  priority,
  taskCollaborationData,
  taskCollaborators,
  subTasks,
  groups,
  projects,
  tasks,
  boardId: parent,
  customId: blockID,
  groupTaskContext: groups,
  groupProjectContext: groups,
  type: userUpdateableblockTypeSchema,
  availableStatus: statusListSchema,
  availableLabels: LabelListSchema,
  status: validationSchemas.uuid,
  labels: Joi.array()
    .items(validationSchemas.uuid)
    .max(blockConstants.maxAvailableLabels),
});

const blockValidationSchemas = {
  name,
  lowerCasedName,
  blockID,
  expectedEndAt,
  description,
  createdAt,
  color,
  createdBy,
  taskCollaborationData,
  taskCollaborators,
  priority,
  tasks,
  groups,
  projects,
  subTasks,
  parent,
  rootBlockID,
  updatedAt,
  newBlock,
  groupContext,
  blockTypesList: blockTypesSchema,
  type: userUpdateableblockTypeSchema,
  fullBlockType: fullBlockTypeSchema,
  statusSchema,
  labelSchema,
  statusListSchema,
  LabelListSchema,
  updateDescription,
};

export default blockValidationSchemas;
