import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { accessControlConstants } from "../constants";
import accessControlValidationSchemas from "../validation";

export const newRoleInputJoiSchema = Joi.object().keys({
    name: accessControlValidationSchemas.name.required(),
    description: accessControlValidationSchemas.description.allow([null]),
    prevRoleId: validationSchemas.uuid.allow([null]),
    nextRoleId: validationSchemas.uuid.allow([null]),
});

export const updateRoleInputJoiSchema = Joi.object().keys({
    name: accessControlValidationSchemas.name.allow([null]),
    description: accessControlValidationSchemas.description.allow([null]),
    prevRoleId: validationSchemas.uuid.allow([null]),
    nextRoleId: validationSchemas.uuid.allow([null]),
});

const addRoleJoiSchema = Joi.object().keys({
    tempId: validationSchemas.uuid.required(),
    data: newRoleInputJoiSchema.required(),
});

const updateRoleJoiSchema = Joi.object().keys({
    customId: validationSchemas.uuid.required(),
    data: updateRoleInputJoiSchema.required(),
});

export const setRolesJoiSchema = Joi.object().keys({
    blockId: validationSchemas.uuid.required(),
    permissions: Joi.object().keys({
        add: Joi.array()
            .items(addRoleJoiSchema)
            .unique("tempId")
            .max(accessControlConstants.maxPermissions),
        update: Joi.array()
            .items(updateRoleJoiSchema)
            .unique("customId")
            .max(accessControlConstants.maxPermissions),
        remove: Joi.array()
            .items(validationSchemas.uuid.required())
            .unique()
            .max(accessControlConstants.maxPermissions),
    }),
});
