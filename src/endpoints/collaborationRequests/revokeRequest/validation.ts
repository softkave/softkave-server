import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const revokeRequestJoiSchema = Joi.object().keys({
    requestId: validationSchemas.uuid.required(),
    organizationId: validationSchemas.uuid.required(),
});
