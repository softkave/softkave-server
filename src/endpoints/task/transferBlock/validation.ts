import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const transferBlockJoiSchema = Joi.object().keys({
    draggedBlockId: validationSchemas.uuid.required(),
    destinationBlockId: validationSchemas.uuid.required(),
});
