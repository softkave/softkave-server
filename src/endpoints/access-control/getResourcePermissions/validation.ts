import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getResourcePermissionsJoiSchema = Joi.object().keys({
    blockId: validationSchemas.uuid.required(),
});
