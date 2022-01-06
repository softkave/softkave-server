import Joi from "joi";
import { DefaultPermissionGroupNames } from "../../mongo/access-control/definitions";
import { validationSchemas } from "../../utilities/validationUtils";
import { blockConstants } from "../block/constants";
import { accessControlConstants } from "./constants";

const name = Joi.string()
    .trim()
    .max(accessControlConstants.maxPermissionGroupNameLength);

const description = Joi.string()
    .allow(null, "")
    .max(accessControlConstants.maxPermissionGroupDescriptionLength)
    .trim();

const permissionGroupResourceType = Joi.string().valid(
    ...accessControlConstants.permissionGroupResourceTypes
);

const permissionResourceType = Joi.string().valid(
    ...accessControlConstants.permissionResourceTypes
);

const permissionActionType = Joi.string().valid(
    ...accessControlConstants.permissionActionTypes
);

const permissionGroupId = validationSchemas.uuid.allow(
    DefaultPermissionGroupNames.Public
);

const userIds = Joi.array()
    .items(validationSchemas.uuid.required())
    .unique()
    .max(blockConstants.maxCollaborators);

const accessControlValidationSchemas = {
    name,
    description,
    permissionGroupResourceType,
    permissionActionType,
    permissionResourceType,
    permissionGroupId,
    userIds,
};

export default accessControlValidationSchemas;
