const Joi = require("joi");
const { uuidSchema } = require("../validation-utils");
const constants = require("./constants");
const { validate } = require("../joi-utils");

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
    .regex(/#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})\b/),
  updatedAt: Joi.number(),
  type: Joi.string()
    .lowercase()
    .valid(constants.blockTypes),
  parents: Joi.array()
    .items(uuidSchema)
    .unique()
    .max(constants.maxParentsLength),
  createdBy: uuidSchema,
  taskCollaborators: taskCollaboratorsSchema,
  priority: Joi.string()
    .lowercase()
    .valid(constants.priorityValues)
});

const addCollaboratorSchema = Joi.object().keys({
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

const addCollaboratorValuesSchema = Joi.array()
  .items(addCollaboratorSchema)
  .min(constants.minAddCollaboratorValuesLength)
  .max(constants.maxAddCollaboratorValuesLength);

const addCollaboratorParamsSchema = Joi.object().keys({
  block: blockParamSchema,
  collaborators: addCollaboratorValuesSchema
  // body: Joi.string()
  //   .min(constants.minAddCollaboratorBodyMessageLength)
  //   .max(constants.maxAddCollaboratorBodyMessageLength),
  // expiresAt: Joi.number()
});

const blockTypesSchema = Joi.array()
  .max(constants.blockTypes.length)
  .unique()
  .items(blockTypeSchema);

exports.validateBlock = function validateBlock(block) {
  return validate(block, blockSchema);
};

exports.validateTaskCollaborators = function validateTaskCollaborators(
  collaborators
) {
  return validate(collaborators, taskCollaboratorsSchema);
};

exports.validateBlockParam = function validateBlockParam(param) {
  return validate(param, blockParamSchema);
};

exports.validateAddCollaboratorParams = function validateAddCollaboratorParams(
  params
) {
  return validate(params, addCollaboratorParamsSchema);
};

exports.validateBlockTypes = function validateBlockType(types) {
  return validate(types, blockTypesSchema);
};
