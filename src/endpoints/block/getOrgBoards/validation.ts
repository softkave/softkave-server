import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getBlockChildrenJoiSchema = Joi.object().keys({
    orgId: validationSchemas.uuid.required(),
});
