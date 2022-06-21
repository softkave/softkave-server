import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getOrganizationCollaborationRequestsJoiSchema = Joi.object().keys({
    organizationId: validationSchemas.uuid.required(),
});
