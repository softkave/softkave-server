import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getBlockChildrenJoiSchema = Joi.object().keys({
    organizationId: validationSchemas.uuid.required(),
});
