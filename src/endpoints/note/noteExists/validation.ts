import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import noteValidationSchemas from "../validation";

export const noteExistsJoiSchema = Joi.object().keys({
  name: noteValidationSchemas.name.required(),
  blockId: validationSchemas.uuid.required(),
});
