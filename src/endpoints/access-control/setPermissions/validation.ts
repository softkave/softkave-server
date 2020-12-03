import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { blockConstants } from "../../block/constants";
import { accessControlConstants } from "../constants";
import accessControlValidationSchemas from "../validation";

const roles = Joi.array()
    .items(accessControlValidationSchemas.roleId)
    .unique()
    .max(accessControlConstants.maxRoles);

const users = Joi.array()
    .items(validationSchemas.uuid)
    .unique()
    .max(blockConstants.maxCollaborators);

export const updatePermissionInputJoiSchema = Joi.object().keys({
    roles,
    users,
});

const updatePermissionJoiSchema = Joi.object().keys({
    customId: validationSchemas.uuid.required(),
    data: updatePermissionInputJoiSchema.required(),
});

export const setPermissionsJoiSchema = Joi.object().keys({
    blockId: validationSchemas.uuid.required(),
    permissions: Joi.array()
        .items(updatePermissionJoiSchema)
        .unique("customId")
        .max(accessControlConstants.maxPermissions),
});
