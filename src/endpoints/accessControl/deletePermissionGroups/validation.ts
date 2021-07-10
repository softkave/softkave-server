import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { accessControlConstants } from "../constants";

export const deletePermissionGroupsJoiSchema = Joi.object().keys({
    blockId: validationSchemas.uuid.required(),
    permissionGroups: Joi.array()
        .items(validationSchemas.uuid.required())
        .unique()
        .max(accessControlConstants.maxPermissionGroups),
});
