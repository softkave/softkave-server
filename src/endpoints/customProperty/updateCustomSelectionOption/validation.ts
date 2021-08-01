import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const createPropertyJoiSchema = Joi.object().keys({
    blockId: validationSchemas.uuid.required(),
});
