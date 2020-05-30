import Joi from "joi";
import { BlockType } from "../../mongo/block";
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

const userUpdateableTypes = ["org", "board", "task"] as BlockType[];
const userUpdateableblockTypeSchema = Joi.string()
  .lowercase()
  .valid(userUpdateableTypes);

const fullBlockTypes = [...userUpdateableTypes, "root"] as BlockType[];
const fullBlockTypeSchema = Joi.string().lowercase().valid(fullBlockTypes);

const subTasksSchema = Joi.object().keys({
  customId: Joi.string().uuid().required(),
  description: Joi.string()
    .trim()
    .min(blockConstants.minDescriptionLength)
    .max(blockConstants.maxDescriptionLength)
    .required(),
  completedBy: Joi.string().uuid().allow(null),
  completedAt: Joi.number().allow(null),
});

// TODO: run trim on all string inputs
const labelSchema = Joi.object().keys({
  customId: Joi.string().uuid().required(),
  name: Joi.string()
    .lowercase()
    .trim()
    .min(blockConstants.minLabelNameLength)
    .max(blockConstants.maxLabelNameLength)
    .required(),
  description: Joi.string()
    .allow("", null)
    .trim()
    .min(blockConstants.minLabelDescriptionLength)
    .max(blockConstants.maxLabelDescriptionLength),
  color: Joi.string().trim().lowercase().regex(regEx.hexColorPattern),
  createdAt: Joi.number().allow(null),
  createdBy: Joi.string().uuid().allow("system", null),
  updatedAt: Joi.number().allow(null),
  updatedBy: Joi.string().uuid().allow("system", null),
});

const statusSchema = Joi.object().keys({
  customId: Joi.string().uuid().required(),
  name: Joi.string()
    .trim()
    .lowercase()
    .min(blockConstants.minLabelNameLength)
    .max(blockConstants.maxLabelNameLength)
    .required(),
  description: Joi.string()
    .allow("", null)
    .trim()
    .min(blockConstants.minLabelDescriptionLength)
    .max(blockConstants.maxLabelDescriptionLength),
  createdAt: Joi.number().allow(null),
  createdBy: Joi.string().uuid().allow("system", null),
  updatedAt: Joi.number().allow(null),

  // TODO: allowing "system" allows boycotting the real data which can be exploited
  updatedBy: Joi.string().uuid().allow("system", null),
});

const statusListSchema = Joi.array()
  .max(blockConstants.maxAvailableLabels)
  .items(statusSchema);
// TODO: should labels and statuses be unique?
// .unique((a: IBlockStatus, b: IBlockStatus) => {
//   return a.customId === b.customId || a.name === b.name;
// });

const labelListSchema = Joi.array()
  .max(blockConstants.maxAvailableLabels)
  .items(labelSchema);
// .unique((a: IBlockLabel, b: IBlockLabel) => {
//   return a.customId === b.customId || a.name === b.name;
// });

const blockTypesSchema = Joi.array()
  .max(blockConstants.blockTypesArray.length)
  .unique()
  .items(userUpdateableblockTypeSchema);

const blockId = validationSchemas.uuid;
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
  is: Joi.string().valid(["group", "board", "task"] as BlockType[]),
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
  .min(blockConstants.minSubTasksLength)
  .max(blockConstants.maxSubTasksLength);

const newBlock = Joi.object().keys({
  name,
  description,
  expectedEndAt,
  color,
  parent,
  rootBlockID: rootBlockId,
  priority,
  assignees: taskAssignees,
  subTasks,
  customId: blockId,
  type: userUpdateableblockTypeSchema,
  boardStatuses: statusListSchema,
  boardLabels: labelListSchema,
  status: validationSchemas.uuid,
  labels: Joi.array()
    .items(validationSchemas.uuid)
    .max(blockConstants.maxAvailableLabels),
});

const blockValidationSchemas = {
  name,
  lowerCasedName,
  blockId,
  expectedEndAt,
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
  labelListSchema,
  updateDescription,
};

export default blockValidationSchemas;
