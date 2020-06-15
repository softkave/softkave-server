import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const subscribeToBlockJoiSchema = Joi.object().keys({
  blockId: validationSchemas.uuid,
});
