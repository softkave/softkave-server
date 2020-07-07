import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getNotesJoiSchema = Joi.object().keys({
  blockId: validationSchemas.uuid.required(),
});
