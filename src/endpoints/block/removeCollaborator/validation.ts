import Joi from "joi";
import { validationSchemas } from "utils/validationUtils";
import blockValidationSchemas from "../validation";

export const removeCollaboratorJoiSchema = Joi.object().keys({
  blockID: blockValidationSchemas.blockID,
  collaboratorID: validationSchemas.uuid
});
