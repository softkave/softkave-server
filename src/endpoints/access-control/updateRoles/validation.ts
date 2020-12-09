import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { accessControlConstants } from "../constants";
import accessControlValidationSchemas from "../validation";

export const updateRoleInputJoiSchema = Joi.object().keys({
    name: accessControlValidationSchemas.name.allow([null]),
    description: accessControlValidationSchemas.description.allow([null]),
    prevRoleId: validationSchemas.uuid.allow([null]),
    nextRoleId: validationSchemas.uuid.allow([null]),
});

const updateRoleJoiSchema = Joi.object().keys({
    customId: validationSchemas.uuid.required(),
    data: updateRoleInputJoiSchema.required(),
});

export const setRolesJoiSchema = Joi.object().keys({
    blockId: validationSchemas.uuid.required(),
    roles: Joi.array()
        .items(updateRoleJoiSchema)
        .unique("customId")
        .max(accessControlConstants.maxPermissions),
});
