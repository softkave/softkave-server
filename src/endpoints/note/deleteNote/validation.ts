import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const deleteNoteJoiSchema = Joi.object().keys({
  noteId: validationSchemas.uuid.required(),
});
