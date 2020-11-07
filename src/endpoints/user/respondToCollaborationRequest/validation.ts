import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import userValidationSchema from "../validation";

export const respondToCollaborationRequestJoiSchema = Joi.object().keys({
    requestId: validationSchemas.uuid.required(),
    response: userValidationSchema.collaborationRequestResponse.required(),
});
