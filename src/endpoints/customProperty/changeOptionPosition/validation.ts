import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const changeOptionPositionJoiSchema = Joi.object()
    .keys({
        customId: validationSchemas.uuid.required(),
        prevOptionId: validationSchemas.uuid.allow(null),
    })
    .required();
