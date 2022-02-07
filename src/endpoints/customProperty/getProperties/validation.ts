import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getPropertiesJoiSchema = Joi.object().keys({
    parentId: validationSchemas.uuid.required(),
});
