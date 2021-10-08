import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const deleteOptionJoiSchema = Joi.object().keys({
    customId: validationSchemas.uuid.required(),
});
