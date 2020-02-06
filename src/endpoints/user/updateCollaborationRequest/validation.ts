import Joi from "joi";
import { validationSchemas } from "utils/validationUtils";
import { collaborationRequestSchema } from "validations/user/validations";

export const updateCollaborationRequestSchema = Joi.object().keys({
  customId: validationSchemas.uuid,
  data: collaborationRequestSchema
});
