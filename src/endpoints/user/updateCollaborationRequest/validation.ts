import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const updateCollaborationRequestSchema = Joi.object().keys({
  customId: validationSchemas.uuid,
  data: Joi.object().keys({
    readAt: Joi.number()
  })
});
