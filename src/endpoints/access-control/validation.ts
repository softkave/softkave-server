import Joi from "joi";
import { AccessControlDefaultRoles } from "../../mongo/access-control/definitions";
import { validationSchemas } from "../../utilities/validationUtils";
import { accessControlConstants } from "./constants";

const name = Joi.string().trim().max(accessControlConstants.maxRoleNameLength);

const description = Joi.string()
    .allow(null)
    .max(accessControlConstants.maxRoleDescriptionLength)
    .trim();

const roleResourceType = Joi.string().valid(
    accessControlConstants.roleResourceTypes
);

const permissionResourceType = Joi.string().valid(
    accessControlConstants.permissionResourceTypes
);

const permissionActionType = Joi.string().valid(
    accessControlConstants.permissionActionTypes
);

const roleId = validationSchemas.uuid.allow([AccessControlDefaultRoles.Public]);

const accessControlValidationSchemas = {
    name,
    description,
    roleResourceType,
    permissionActionType,
    permissionResourceType,
    roleId,
};

export default accessControlValidationSchemas;
