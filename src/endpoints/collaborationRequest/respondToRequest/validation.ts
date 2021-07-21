import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import userValidationSchemas from "../../user/validation";

export const respondToCollaborationRequestJoiSchema = Joi.object().keys({
    requestId: validationSchemas.uuid.required(),
    response: userValidationSchemas.collaborationRequestResponse.required(),
});
