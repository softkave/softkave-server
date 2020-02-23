import Joi from "joi";
import { BlockType } from "mongo/block";
import { regEx, validationSchemas } from "../../utils/validationUtils";
import { blockConstants } from "./constants";

const taskCollaboratorSchema = Joi.object().keys({
  userId: validationSchemas.uuid,
  assignedBy: validationSchemas.uuid,
  assignedAt: Joi.number(),

  // Allow null because sometimes, the value from the API or in DB is null,
  // and it leads to a false validation error
  completedAt: Joi.number().allow(null)
});

const taskCollaboratorsListSchema = Joi.array()
  .min(blockConstants.minTaskCollaboratorsLength)
  .max(blockConstants.maxTaskCollaboratorsLength)
  .unique("userId")
  .items(taskCollaboratorSchema);

const userUpdateableTypes = ["group", "org", "project", "task"] as BlockType[];
const blockType = Joi.string()
  .lowercase()
  .valid(userUpdateableTypes);

const blockChildrenIDList = Joi.array()
  .items(validationSchemas.uuid)
  .unique()
  .max(blockConstants.maxChildrenCount);

const subTasksSchema = Joi.object().keys({
  customId: Joi.string()
    .uuid()
    .required(),
  description: Joi.string()
    .min(blockConstants.minDescriptionLength)
    .max(blockConstants.maxDescriptionLength)
    .trim()
    .required(),
  completedBy: Joi.string().uuid(),
  completedAt: Joi.number()
});

const taskCollaborationDataSchema = Joi.object().keys({
  collaborationType: Joi.string()
    .lowercase()
    .valid(blockConstants.taskCollaborationData),
  completedAt: Joi.number().allow(null),
  completedBy: Joi.string()
    .uuid()
    .allow(null)
});

const blockTypesSchema = Joi.array()
  .max(blockConstants.blockTypesArray.length)
  .unique()
  .items(blockType);

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
    then: Joi.required()
  });

const expectedEndAt = Joi.number();
const createdAt = Joi.number();
const color = Joi.string()
  .trim()
  .lowercase()
  .regex(regEx.hexColorPattern);

const updatedAt = Joi.number();
const type = blockType;
const parent = validationSchemas.uuid.when("type", {
  is: Joi.string().valid(["group", "project", "task"] as BlockType[]),
  then: Joi.required()
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
  type,
  parent,
  rootBlockID,
  priority,
  taskCollaborationData,
  taskCollaborators,
  subTasks,
  groups,
  projects,
  tasks,
  customId: blockID,
  groupTaskContext: groups,
  groupProjectContext: groups
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
  type,
  newBlock,
  groupContext,
  blockTypesList: blockTypesSchema
};

export default blockValidationSchemas;
