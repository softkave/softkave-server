import Joi from "joi";
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

const blockType = Joi.string()
  .lowercase()
  .valid(blockConstants.blockTypesArray);

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
const parents = Joi.array()
  .items(validationSchemas.uuid)
  .unique()
  .max(blockConstants.maxParentsLength);

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

const block = Joi.object().keys({
  // TODO: blockID or just id
  blockID,
  name,
  description,
  expectedEndAt,
  createdAt,
  color,
  updatedAt,
  parents,
  createdBy,
  subTasks,
  priority,
  taskCollaborationData: taskCollaborationDataSchema,
  taskCollaborators: taskCollaboratorsListSchema,
  tasks: blockChildrenIDList,
  groups: blockChildrenIDList,
  projects: blockChildrenIDList,
  type: blockType
});

const blockValidationSchemas = {
  name,
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
  parents,
  updatedAt,
  type,
  block,
  blockTypesList: blockTypesSchema
};

export default blockValidationSchemas;
