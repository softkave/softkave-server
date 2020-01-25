import Joi from "joi";
import userValidationSchema from "../validation";
import { validationSchemas } from "utils/validationUtils";

export const respondToCollaborationRequestJoiSchema = Joi.object().keys({
  customId: validationSchemas.uuid,
  response: userValidationSchema.collaborationRequestResponse
});
