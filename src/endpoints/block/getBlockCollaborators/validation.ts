import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getBlockCollaboratorsJoiSchema = Joi.object().keys({
    blockId: validationSchemas.uuid.required(),
});
