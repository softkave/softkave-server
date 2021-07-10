import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getOrgCollaborationRequestsJoiSchema = Joi.object().keys({
    orgId: validationSchemas.uuid.required(),
});
