import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { accessControlConstants } from "../constants";
import accessControlValidationSchemas from "../validation";

const roleInput = Joi.object().keys({
    name: accessControlValidationSchemas.name.invalid(["public"]).required(),
    description: accessControlValidationSchemas.description.allow([null]),
    prevRoleId: validationSchemas.uuid.allow([null]),
    nextRoleId: validationSchemas.uuid.allow([null]),
});

const addRoleJoiSchema = Joi.object().keys({
    tempId: validationSchemas.uuid.required(),
    data: roleInput.required(),
});

export const setRolesJoiSchema = Joi.object().keys({
    blockId: validationSchemas.uuid.required(),
    roles: Joi.array()
        .items(addRoleJoiSchema)
        .unique("tempId")
        .max(accessControlConstants.maxPermissions),
});
