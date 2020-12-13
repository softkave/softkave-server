import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getPermissionGroupsJoiSchema = Joi.object().keys({
    blockId: validationSchemas.uuid.required(),
});
