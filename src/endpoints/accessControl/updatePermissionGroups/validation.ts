import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { accessControlConstants } from "../constants";
import accessControlValidationSchemas from "../validation";

export const updatePermissionGroupInputJoiSchema = Joi.object().keys({
    name: accessControlValidationSchemas.name.allow(null, ""),
    description: accessControlValidationSchemas.description.allow(null, ""),
    prevId: validationSchemas.uuid.allow(null),
    nextId: validationSchemas.uuid.allow(null),
    users: Joi.object().keys({
        add: accessControlValidationSchemas.userIds,
        remove: accessControlValidationSchemas.userIds,
    }),
});

export const updatePermissionGroupsJoiSchema = Joi.object().keys({
    blockId: validationSchemas.uuid.required(),
    permissionGroups: Joi.array()
        .items(
            Joi.object().keys({
                customId: validationSchemas.uuid.required(),
                data: updatePermissionGroupInputJoiSchema.required(),
            })
        )
        .unique("customId")
        .max(accessControlConstants.maxPermissions),
});
