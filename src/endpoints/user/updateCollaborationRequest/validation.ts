import Joi from "joi";
import { validationSchemas } from "utils/validationUtils";

export const updateCollaborationRequestSchema = Joi.object().keys({
  customId: validationSchemas.uuid,
  data: Joi.object().keys({
    readAt: Joi.number()
  })
});
