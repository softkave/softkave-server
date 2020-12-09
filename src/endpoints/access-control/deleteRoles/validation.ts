import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { accessControlConstants } from "../constants";

export const setRolesJoiSchema = Joi.object().keys({
    blockId: validationSchemas.uuid.required(),
    permissions: Joi.array()
        .items(validationSchemas.uuid.required())
        .unique()
        .max(accessControlConstants.maxPermissions),
});
