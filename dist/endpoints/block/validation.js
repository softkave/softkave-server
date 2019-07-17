"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const joi_utils_1 = require("../../utils/joi-utils");
const validation_utils_1 = require("../../utils/validation-utils");
const constants_1 = require("../notification/constants");
const actions_1 = require("./actions");
const constants_2 = require("./constants");
const blockParamSchema = joi_1.default.object().keys({
    customId: validation_utils_1.joiSchemas.uuidSchema
});
const taskCollaboratorSchema = joi_1.default.object().keys({
    userId: validation_utils_1.joiSchemas.uuidSchema,
    completedAt: joi_1.default.number(),
    assignedBy: validation_utils_1.joiSchemas.uuidSchema,
    assignedAt: joi_1.default.number()
});
const taskCollaboratorsSchema = joi_1.default.array()
    .min(constants_2.blockConstants.minTaskCollaboratorsLength)
    .max(constants_2.blockConstants.maxTaskCollaboratorsLength)
    .unique("email")
    .items(taskCollaboratorSchema);
const blockTypeSchema = joi_1.default.string()
    .lowercase()
    .valid(constants_2.blockConstants.blockTypesArray);
const blockChildrenSchema = joi_1.default.array()
    .items(validation_utils_1.joiSchemas.uuidSchema)
    .unique()
    .max(constants_2.blockConstants.maxChildrenCount);
const roleNameSchema = joi_1.default.string()
    .lowercase()
    .min(constants_2.blockConstants.minRoleNameLength)
    .max(constants_2.blockConstants.maxRoleNameLength);
const roleNameArraySchema = joi_1.default.array()
    .items(roleNameSchema)
    .unique()
    .max(constants_2.blockConstants.maxRoles);
const accessControlSchema = joi_1.default.object().keys({
    orgId: validation_utils_1.joiSchemas.uuidSchema,
    actionName: joi_1.default.string()
        .uppercase()
        .valid(actions_1.blockActionsArray),
    permittedRoles: roleNameArraySchema
});
const accessControlArraySchema = joi_1.default.array()
    .items(accessControlSchema)
    .unique("actionName")
    .max(actions_1.blockActionsArray.length);
const blockSchema = joi_1.default.object().keys({
    customId: validation_utils_1.joiSchemas.uuidSchema,
    name: joi_1.default.string()
        .trim()
        .min(constants_2.blockConstants.minNameLength)
        .max(constants_2.blockConstants.maxNameLength),
    description: joi_1.default.string()
        .min(constants_2.blockConstants.minDescriptionLength)
        .max(constants_2.blockConstants.maxDescriptionLength)
        .when("type", {
        is: "task",
        then: joi_1.default.required()
    }),
    expectedEndAt: joi_1.default.number(),
    createdAt: joi_1.default.number(),
    color: joi_1.default.string()
        .trim()
        .lowercase()
        .regex(validation_utils_1.regEx.hexColorPattern),
    updatedAt: joi_1.default.number(),
    type: blockTypeSchema,
    parents: joi_1.default.array()
        .items(validation_utils_1.joiSchemas.uuidSchema)
        .unique()
        .max(constants_2.blockConstants.maxParentsLength),
    createdBy: validation_utils_1.joiSchemas.uuidSchema,
    taskCollaborators: taskCollaboratorsSchema,
    priority: joi_1.default.string()
        .lowercase()
        .valid(constants_2.blockConstants.priorityValuesArray),
    position: joi_1.default.number().min(0),
    positionTimestamp: joi_1.default.number().min(0),
    tasks: blockChildrenSchema,
    groups: blockChildrenSchema,
    projects: blockChildrenSchema,
    groupTaskContext: blockChildrenSchema,
    groupProjectContext: blockChildrenSchema,
    isBacklog: joi_1.default.boolean(),
    // TODO: make a check to make sure this is only checked on orgs or roots
    accessControl: joi_1.default.array()
        .items(accessControlSchema)
        .unique((item1, item2) => {
        return (item1.organizationID === item2.organizationID &&
            item1.actionName !== item2.actionName);
    })
        .min(constants_2.blockConstants.minRoles)
        .max(constants_2.blockConstants.maxRoles)
});
const addCollaboratorCollaboratorSchema = joi_1.default.object().keys({
    email: joi_1.default.string()
        .required()
        .trim()
        .email()
        .lowercase(),
    body: joi_1.default.string()
        .min(constants_1.notificationConstants.minAddCollaboratorMessageLength)
        .max(constants_1.notificationConstants.maxAddCollaboratorMessageLength),
    expiresAt: joi_1.default.number(),
    customId: validation_utils_1.joiSchemas.uuidSchema
});
const addCollaboratorCollaboratorsSchema = joi_1.default.array()
    .items(addCollaboratorCollaboratorSchema)
    .min(constants_2.blockConstants.minAddCollaboratorValuesLength)
    .max(constants_2.blockConstants.maxAddCollaboratorValuesLength);
const blockTypesSchema = joi_1.default.array()
    .max(constants_2.blockConstants.blockTypesArray.length)
    .unique()
    .items(blockTypeSchema);
const groupContextSchema = joi_1.default.string()
    .lowercase()
    .valid(constants_2.blockConstants.groupContextsArray);
const groupContextArraySchema = joi_1.default.array()
    .max(constants_2.blockConstants.groupContextsArray.length)
    .unique()
    .items(groupContextSchema);
// TODO: define types
function validateBlock(block) {
    return joi_utils_1.validate(block, blockSchema);
}
exports.validateBlock = validateBlock;
function validateGroupContexts(contexts) {
    return joi_utils_1.validate(contexts, groupContextArraySchema);
}
exports.validateGroupContexts = validateGroupContexts;
function validateTaskCollaborators(collaborators) {
    return joi_utils_1.validate(collaborators, taskCollaboratorsSchema);
}
exports.validateTaskCollaborators = validateTaskCollaborators;
function validateBlockParam(param) {
    return joi_utils_1.validate(param, blockParamSchema);
}
exports.validateBlockParam = validateBlockParam;
function validateBlockTypes(types) {
    return joi_utils_1.validate(types, blockTypesSchema);
}
exports.validateBlockTypes = validateBlockTypes;
function validateAddCollaboratorCollaborators(params) {
    return joi_utils_1.validate(params, addCollaboratorCollaboratorsSchema);
}
exports.validateAddCollaboratorCollaborators = validateAddCollaboratorCollaborators;
function validateRoleName(params) {
    return joi_utils_1.validate(params, roleNameSchema);
}
exports.validateRoleName = validateRoleName;
function validateRoleNameArray(params) {
    return joi_utils_1.validate(params, roleNameArraySchema);
}
exports.validateRoleNameArray = validateRoleNameArray;
function validateAccessControlArray(params) {
    return joi_utils_1.validate(params, accessControlArraySchema);
}
exports.validateAccessControlArray = validateAccessControlArray;
//# sourceMappingURL=validation.js.map