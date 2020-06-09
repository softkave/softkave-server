import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import noteValidationSchemas from "../validation";

export const updateNoteJoiSchema = Joi.object().keys({
  data: noteValidationSchemas.updateNote.required(),
  noteId: validationSchemas.uuid.required(),
});
