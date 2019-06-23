const Joi = require("joi");
const { uuidSchema, hexColorRegEx } = require("../../utils/validation-utils");
const constants = require("./constants");
const { validate } = require("../../utils/joi-utils");

module.exports = exports;

const blockParamSchema = Joi.object().keys({
  customId: uuidSchema
});

const taskCollaboratorSchema = Joi.object().keys({
  userId: uuidSchema,
  completedAt: Joi.number(),
  assignedBy: uuidSchema,
  assignedAt: Joi.number()
});

const taskCollaboratorsSchema = Joi.array()
  .min(constants.minTaskCollaboratorsLength)
  .max(constants.maxTaskCollaboratorsLength)
  .unique("email")
  .items(taskCollaboratorSchema);

const blockTypeSchema = Joi.string()
  .lowercase()
  .valid(constants.blockTypes);

const blockChildrenSchema = Joi.array()
  .items(uuidSchema)
  .unique()
  .max(constants.maxChildrenCount);

const blockSchema = Joi.object().keys({
  customId: uuidSchema,
  name: Joi.string()
    .trim(true)
    .min(constants.minNameLength)
    .max(constants.maxNameLength),
  description: Joi.string()
    .min(constants.minDescriptionLength)
    .max(constants.maxDescriptionLength)
    .when("type", {
      is: "task",
      then: Joi.required()
    }),
  expectedEndAt: Joi.number(),
  createdAt: Joi.number(),
  color: Joi.string()
    .trim(true)
    .lowercase()
    .regex(hexColorRegEx),
  updatedAt: Joi.number(),
  type: blockTypeSchema,
  parents: Joi.array()
    .items(uuidSchema)
    .unique()
    .max(constants.maxParentsLength),
  createdBy: uuidSchema,
  taskCollaborators: taskCollaboratorsSchema,
  priority: Joi.string()
    .lowercase()
    .valid(constants.priorityValues),
  position: Joi.number().min(0),
  positionTimestamp: Joi.number().min(0),
  tasks: blockChildrenSchema,
  groups: blockChildrenSchema,
  projects: blockChildrenSchema,
  groupTaskContext: blockChildrenSchema,
  groupProjectContext: blockChildrenSchema
});

const addCollaboratorCollaboratorSchema = Joi.object().keys({
  email: Joi.string()
    .required()
    .trim(true)
    .email()
    .lowercase(),
  body: Joi.string()
    .min(constants.minAddCollaboratorBodyMessageLength)
    .max(constants.maxAddCollaboratorBodyMessageLength),
  expiresAt: Joi.number(),
  customId: uuidSchema
});

const addCollaboratorCollaboratorsSchema = Joi.array()
  .items(addCollaboratorCollaboratorSchema)
  .min(constants.minAddCollaboratorValuesLength)
  .max(constants.maxAddCollaboratorValuesLength);

const blockTypesSchema = Joi.array()
  .max(constants.blockTypes.length)
  .unique()
  .items(blockTypeSchema);

const groupContextSchema = Joi.string()
  .lowercase()
  .valid(constants.groupContexts);

const groupContextArraySchema = Joi.array()
  .max(constants.groupContexts.length)
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
