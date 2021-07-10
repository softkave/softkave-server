import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getOrgCollaboratorsJoiSchema = Joi.object().keys({
    orgId: validationSchemas.uuid.required(),
});
