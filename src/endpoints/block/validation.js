const Joi = require("joi");

const { joiSchemas, regEx } = require("../../utils/validation-utils");
const { constants: blockConstants } = require("./constants");
const { validate } = require("../../utils/joi-utils");
const {
  constants: notificationConstants
} = require("../notification/constants");

module.exports = exports;

const blockParamSchema = Joi.object().keys({
  customId: joiSchemas.uuidSchema
});

const taskCollaboratorSchema = Joi.object().keys({
  userId: joiSchemas.uuidSchema,
  completedAt: Joi.number(),
  assignedBy: joiSchemas.uuidSchema,
  assignedAt: Joi.number()
});

const taskCollaboratorsSchema = Joi.array()
  .min(blockConstants.minTaskCollaboratorsLength)
  .max(blockConstants.maxTaskCollaboratorsLength)
  .unique("email")
  .items(taskCollaboratorSchema);

const blockTypeSchema = Joi.string()
  .lowercase()
  .valid(blockConstants.blockTypesArray);

const blockChildrenSchema = Joi.array()
  .items(joiSchemas.uuidSchema)
  .unique()
  .max(blockConstants.maxChildrenCount);

const blockSchema = Joi.object().keys({
  customId: joiSchemas.uuidSchema,
  name: Joi.string()
    .trim(true)
    .min(blockConstants.minNameLength)
    .max(blockConstants.maxNameLength),
  description: Joi.string()
    .min(blockConstants.minDescriptionLength)
    .max(blockConstants.maxDescriptionLength)
    .when("type", {
      is: "task",
      then: Joi.required()
    }),
  expectedEndAt: Joi.number(),
  createdAt: Joi.number(),
  color: Joi.string()
    .trim(true)
    .lowercase()
    .regex(regEx.hexColorPattern),
  updatedAt: Joi.number(),
  type: blockTypeSchema,
  parents: Joi.array()
    .items(joiSchemas.uuidSchema)
    .unique()
    .max(blockConstants.maxParentsLength),
  createdBy: joiSchemas.uuidSchema,
  taskCollaborators: taskCollaboratorsSchema,
  priority: Joi.string()
    .lowercase()
    .valid(blockConstants.priorityValuesArray),
  position: Joi.number().min(0),
  positionTimestamp: Joi.number().min(0),
  tasks: blockChildrenSchema,
  groups: blockChildrenSchema,
  projects: blockChildrenSchema,
  groupTaskContext: blockChildrenSchema,
  groupProjectContext: blockChildrenSchema,
  isBacklog: Joi.boolean()
});

const addCollaboratorCollaboratorSchema = Joi.object().keys({
  email: Joi.string()
    .required()
    .trim(true)
    .email()
    .lowercase(),
  body: Joi.string()
    .min(notificationConstants.minAddCollaboratorBodyMessageLength)
    .max(notificationConstants.maxAddCollaboratorBodyMessageLength),
  expiresAt: Joi.number(),
  customId: joiSchemas.uuidSchema
});

const addCollaboratorCollaboratorsSchema = Joi.array()
  .items(addCollaboratorCollaboratorSchema)
  .min(blockConstants.minAddCollaboratorValuesLength)
  .max(blockConstants.maxAddCollaboratorValuesLength);

const blockTypesSchema = Joi.array()
  .max(blockConstants.blockTypesArray.length)
  .unique()
  .items(blockTypeSchema);

const groupContextSchema = Joi.string()
  .lowercase()
  .valid(blockConstants.groupContextsArray);

const groupContextArraySchema = Joi.array()
  .max(blockConstants.groupContextsArray.length)
  .unique()
  .items(groupContextSchema);

exports.validateBlock = function validateBlock(block) {
  return validate(block, blockSchema);
};

exports.validateGroupContexts = function validateGroupContexts(contexts) {
  return validate(contexts, groupContextArraySchema);
};

exports.validateTaskCollaborators = function validateTaskCollaborators(
  collaborators
) {
  return validate(collaborators, taskCollaboratorsSchema);
};

exports.validateBlockParam = function validateBlockParam(param) {
  return validate(param, blockParamSchema);
};

exports.validateBlockTypes = function validateBlockType(types) {
  return validate(types, blockTypesSchema);
};

exports.validateAddCollaboratorCollaborators = function validateAddCollaboratorCollaborators(
  params
) {
  return validate(params, addCollaboratorCollaboratorsSchema);
};
