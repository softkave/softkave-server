import Joi from "joi";

import { validate } from "../../utils/joi-utils";
import { joiSchemas, regEx } from "../../utils/validation-utils";
import { notificationConstants } from "../notification/constants";
import { blockActionsArray } from "./actions";
import { blockConstants } from "./constants";

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

const linkedBlockSchema = Joi.object().keys({
  createdAt: Joi.number(),
  createdBy: joiSchemas.uuidSchema,
  reason: Joi.string()
    .min(blockConstants.minLinkedBlockReasonLength)
    .max(blockConstants.maxLinkedBlockReasonLength),
  blockId: joiSchemas.uuidSchema
});

const roleNameSchema = Joi.string()
  .lowercase()
  .min(blockConstants.minRoleNameLength)
  .max(blockConstants.maxRoleNameLength);

const roleNameArraySchema = Joi.array()
  .items(roleNameSchema)
  .unique()
  .max(blockConstants.maxRoles);

const accessControlSchema = Joi.object().keys({
  orgId: joiSchemas.uuidSchema,
  actionName: Joi.string()
    .uppercase()
    .valid(blockActionsArray),
  permittedRoles: roleNameArraySchema
});

// TODO: split individual schema in different files, classifed by closeness of use
// TODO: merge this schema with the one defined in blockSchema
const accessControlArraySchema = Joi.array()
  .items(accessControlSchema)
  .unique("actionName")
  .max(blockActionsArray.length);

const blockSchema = Joi.object().keys({
  customId: joiSchemas.uuidSchema,
  name: Joi.string()
    .trim()
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
    .trim()
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
  isBacklog: Joi.boolean(),
  linkedBlock: Joi.array()
    .optional()
    .items(linkedBlockSchema)
    .unique("blockId")
    .min(blockConstants.minLinkedBlocksCount)
    .max(blockConstants.maxLinkedBlocksCount),

  // TODO: make a check to make sure this is only checked on orgs or roots
  accessControl: Joi.array()
    .optional()
    .items(accessControlSchema)
    .unique((item1, item2) => {
      return (
        item1.organizationID === item2.organizationID &&
        item1.actionName !== item2.actionName
      );
    })
    .min(blockConstants.minRoles)
    .max(blockConstants.maxRoles),

  // TODO: define schema
  roles: Joi.any().optional()
});

const addCollaboratorCollaboratorSchema = Joi.object().keys({
  email: Joi.string()
    .required()
    .trim()
    .email()
    .lowercase(),
  body: Joi.string()
    .min(notificationConstants.minAddCollaboratorMessageLength)
    .max(notificationConstants.maxAddCollaboratorMessageLength),
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

// TODO: define types
function validateBlock(block: any) {
  return validate(block, blockSchema);
}

function validateGroupContexts(contexts: any) {
  return validate(contexts, groupContextArraySchema);
}

function validateTaskCollaborators(collaborators: any) {
  return validate(collaborators, taskCollaboratorsSchema);
}

function validateBlockParam(param: any) {
  return validate(param, blockParamSchema);
}

function validateBlockTypes(types: any) {
  return validate(types, blockTypesSchema);
}

function validateAddCollaboratorCollaborators(params: any) {
  return validate(params, addCollaboratorCollaboratorsSchema);
}

function validateRoleName(params: any) {
  return validate(params, roleNameSchema);
}

function validateRoleNameArray(params: any) {
  return validate(params, roleNameArraySchema);
}

function validateAccessControlArray(params: any) {
  return validate(params, accessControlArraySchema);
}

export {
  validateAccessControlArray,
  validateAddCollaboratorCollaborators,
  validateBlock,
  validateBlockParam,
  validateBlockTypes,
  validateGroupContexts,
  validateRoleName,
  validateRoleNameArray,
  validateTaskCollaborators
};
