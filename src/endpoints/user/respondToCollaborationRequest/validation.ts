import Joi from "joi";
import { validationSchemas } from "utils/validationUtils";
import userValidationSchema from "../validation";

export const respondToCollaborationRequestJoiSchema = Joi.object().keys({
  customId: validationSchemas.uuid,
  response: userValidationSchema.collaborationRequestResponse
});
