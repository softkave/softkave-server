import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const deletePropertyJoiSchema = Joi.object().keys({
    customId: validationSchemas.uuid.required(),
});
