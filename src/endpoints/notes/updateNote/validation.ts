import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import noteValidationSchemas from "../validation";

const updateNoteInput = Joi.object().keys({
    blockId: validationSchemas.uuid.required(),
    body: noteValidationSchemas.body.required(),
    color: validationSchemas.color.required(),
    name: noteValidationSchemas.name.required(),
});

export const updateNoteJoiSchema = Joi.object().keys({
    data: updateNoteInput.required(),
    noteId: validationSchemas.uuid.required(),
});
