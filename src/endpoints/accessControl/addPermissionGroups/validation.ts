import Joi from "joi";
import { DefaultPermissionGroupNames } from "../../../mongo/access-control/definitions";
import { validationSchemas } from "../../../utilities/validationUtils";
import { accessControlConstants } from "../constants";
import accessControlValidationSchemas from "../validation";

const permissionGroupJoiSchema = Joi.object().keys({
    name: accessControlValidationSchemas.name
        .invalid([DefaultPermissionGroupNames.Public])
        .required(),
    description: accessControlValidationSchemas.description.allow([null, ""]),
    prevId: validationSchemas.uuid.allow([null]),
    nextId: validationSchemas.uuid.allow([null]),
    users: accessControlValidationSchemas.userIds,
});

const addPermissionGroupsPermissionGroupJoiSchema = Joi.object().keys({
    tempId: validationSchemas.uuid.required(),
    data: permissionGroupJoiSchema.required(),
});

export const addPermissionGroupsJoiSchema = Joi.object().keys({
    blockId: validationSchemas.uuid.required(),
    permissionGroups: Joi.array()
        .items(addPermissionGroupsPermissionGroupJoiSchema)
        .unique("tempId")
        .max(accessControlConstants.maxPermissionGroups),
});
