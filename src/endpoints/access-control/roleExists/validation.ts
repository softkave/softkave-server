import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import accessControlValidationSchemas from "../validation";

export const roleExistsJoiSchema = Joi.object().keys({
    blockId: validationSchemas.uuid.required(),
    name: accessControlValidationSchemas.name.required(),
});
