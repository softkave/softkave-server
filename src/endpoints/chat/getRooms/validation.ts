import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getRoomsJoiSchema = Joi.object().keys({
    orgId: validationSchemas.uuid.required(),
});
