import Joi from "joi"
import userValidationSchema from "../validation";

const respondToCollaborationRequestJoiSchema = Joi.object().keys({
  // customId: userValidationSchema,
  response: userValidationSchema.collaborationRequestResponse
});