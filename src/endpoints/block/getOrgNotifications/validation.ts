import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getBlockCollaborationRequestsJoiSchema = Joi.object().keys({
    blockId: validationSchemas.uuid.required(),
});