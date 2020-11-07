import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const revokeRequestJoiSchema = Joi.object().keys({
    requestId: validationSchemas.uuid.required(),
    blockId: validationSchemas.uuid.required(),
});
