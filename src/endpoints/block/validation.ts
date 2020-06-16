import Joi from "joi";
import { BlockType } from "../../mongo/block";
import { regEx, validationSchemas } from "../../utilities/validationUtils";
import { blockConstants } from "./constants";

const taskCollaboratorSchema = Joi.object().keys({
  userId: validationSchemas.uuid,
  assignedBy: validationSchemas.uuid,
  assignedAt: Joi.date(),
});

const taskCollaboratorsListSchema = Joi.array()
  .max(blockConstants.maxTaskCollaboratorsLength)
  .unique("userId")
  .items(taskCollaboratorSchema);

const userUpdateableTypes = [
  BlockType.Org,
  BlockType.Board,
  BlockType.Task,
] as BlockType[];
const userUpdateableblockTypeSchema = Joi.string()
  .lowercase()
  .valid(userUpdateableTypes);

const fullBlockTypes = [...userUpdateableTypes, BlockType.Root] as BlockType[];
const fullBlockTypeSchema = Joi.string().lowercase().valid(fullBlockTypes);
const color = Joi.string().trim().lowercase().regex(regEx.hexColorPattern);

const subTasksSchema = Joi.object().keys({
  customId: Joi.string().uuid().required(),
  description: Joi.string()
    .trim()
    .max(blockConstants.maxDescriptionLength)
    .required(),
  completedBy: Joi.string().uuid().allow(null),
  completedAt: Joi.date().allow(null),
  createdAt: Joi.date(),
  createdBy: Joi.string().uuid(),
  updatedAt: Joi.date(),
  updatedBy: Joi.string().uuid(),
});

// TODO: run trim on all string inputs
const labelSchema = Joi.object().keys({
  color,
  customId: Joi.string().uuid().required(),
  name: Joi.string()
    .lowercase()
    .trim()
    .min(blockConstants.minLabelNameLength)
    .max(blockConstants.maxLabelNameLength)
    .required(),
  description: Joi.string()
    .allow("")
    .trim()
    .max(blockConstants.maxLabelDescriptionLength)
    .optional(),
  createdAt: Joi.date(),
  createdBy: Joi.string().uuid(),
  updatedAt: Joi.date(),
  updatedBy: Joi.string().uuid(),
});

const statusSchema = Joi.object().keys({
  color,
  customId: Joi.string().uuid().required(),
  name: Joi.string()
    .trim()
    .lowercase()
    .min(blockConstants.minLabelNameLength)
    .max(blockConstants.maxLabelNameLength)
    .required(),
  description: Joi.string()
    .allow("")
    .trim()
    .max(blockConstants.maxLabelDescriptionLength)
    .optional(),
  createdAt: Joi.date(),
  createdBy: Joi.string().uuid().allow("system"), // TODO: find a fix. allowing system can be exploited
  updatedAt: Joi.date(),
  updatedBy: Joi.string().uuid(),
});

const statusListSchema = Joi.array()
  .max(blockConstants.maxAvailableLabels)
  .items(statusSchema);
// TODO: should labels and statuses be unique?
// .unique((a: IBlockStatus, b: IBlockStatus) => {
//   return a.customId === b.customId || a.name === b.name;
// });

const boardLabelList = Joi.array()
  .max(blockConstants.maxAvailableLabels)
  .items(labelSchema);
// .unique((a: IBlockLabel, b: IBlockLabel) => {
//   return a.customId === b.customId || a.name === b.name;
// });

const blockTypesSchema = Joi.array()
  .max(blockConstants.blockTypesCount)
  .unique()
  .items(userUpdateableblockTypeSchema);

const blockId = validationSchemas.uuid;
const name = Joi.string().trim().max(blockConstants.maxNameLength);

const lowerCasedName = name.lowercase();

const description = Joi.string()
  .allow("")
  .max(blockConstants.maxDescriptionLength)
  .trim()
  .when("type", {
    is: "task",
    then: Joi.required(),
  });

const updateDescription = Joi.string()
  .allow("")
  .max(blockConstants.maxDescriptionLength)
  .trim();

const dueAt = Joi.date();
const createdAt = Joi.date();

const updatedAt = Joi.date();
const parent = validationSchemas.uuid.when("type", {
  is: Joi.string().valid([BlockType.Board, BlockType.Task] as BlockType[]),
  then: Joi.required(),
});

const rootBlockId = parent;
const createdBy = validationSchemas.uuid;
const taskAssignees = taskCollaboratorsListSchema;
const priority = Joi.string()
  .lowercase()
  .valid(blockConstants.priorityValuesArray);

const subTasks = Joi.array()
  .items(subTasksSchema)
  .max(blockConstants.maxSubTasksLength);

const blockAssignedLabels = Joi.object().keys({
  customId: validationSchemas.uuid,
  assignedBy: validationSchemas.uuid,
  assignedAt: Joi.date(),
});

const blockAssignedLabelsList = Joi.array()
  .items(blockAssignedLabels)
  .max(blockConstants.maxAvailableLabels);

const statusAssignedBy = validationSchemas.uuid.allow("system"); // TODO: exploitable

const newBlock = Joi.object().keys({
  name,
  description,
  dueAt,
  color,
  parent,
  rootBlockId,
  priority,
  assignees: taskAssignees,
  subTasks,
  customId: blockId,
  type: userUpdateableblockTypeSchema,
  boardStatuses: statusListSchema,
  boardLabels: boardLabelList,
  status: validationSchemas.uuid,
  statusAssignedBy,
  statusAssignedAt: Joi.date(),
  labels: blockAssignedLabelsList,
});

const blockValidationSchemas = {
  name,
  lowerCasedName,
  blockId,
  dueAt,
  description,
  createdAt,
  color,
  createdBy,
  assignees: taskAssignees,
  priority,
  subTasks,
  parent,
  rootBlockId,
  updatedAt,
  newBlock,
  blockTypesList: blockTypesSchema,
  type: userUpdateableblockTypeSchema,
  fullBlockType: fullBlockTypeSchema,
  statusSchema,
  labelSchema,
  statusListSchema,
  boardLabelList,
  updateDescription,
  blockAssignedLabels,
  blockAssignedLabelsList,
  statusAssignedBy,
};

export default blockValidationSchemas;
