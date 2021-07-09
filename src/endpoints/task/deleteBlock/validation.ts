import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const deleteBlockJoiSchema = Joi.object().keys({
    blockId: validationSchemas.uuid.required(),
});
