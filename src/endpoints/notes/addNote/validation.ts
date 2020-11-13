import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import noteValidationSchemas from "../validation";

const newNote = Joi.object().keys({
    customId: validationSchemas.uuid.required(),
    blockId: validationSchemas.uuid.required(),
    body: noteValidationSchemas.body.required(),
    color: validationSchemas.color.required(),
    name: noteValidationSchemas.name.required(),
});

export const addNoteJoiSchema = Joi.object().keys({
    note: newNote.required(),
});
