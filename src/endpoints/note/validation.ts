import Joi from "joi";
import { validationSchemas } from "../../utilities/validationUtils";
import { noteConstants } from "./constants";

const noteId = validationSchemas.uuid;
const name = Joi.string().trim().max(noteConstants.maxNameLength).lowercase();
const body = Joi.string().allow("").max(noteConstants.maxBodyLength).trim();

const newNote = Joi.object().keys({
  customId: noteId.required(),
  blockId: validationSchemas.uuid.required(),
  body: body.required(),
  color: validationSchemas.color.required(),
  name: name.required(),
});

const updateNote = Joi.object().keys({
  blockId: validationSchemas.uuid.required(),
  body: body.required(),
  color: validationSchemas.color.required(),
  name: name.required(),
});

const blockValidationSchemas = {
  newNote,
  updateNote,
  name,
};

export default blockValidationSchemas;
