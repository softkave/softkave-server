import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getOrgNotificationsJoiSchema = Joi.object().keys({
    orgId: validationSchemas.uuid.required(),
});
