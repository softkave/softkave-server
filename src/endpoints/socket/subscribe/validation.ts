import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import socketValidationSchemas from "../validation";

export const subscribeJoiSchema = Joi.object().keys({
  customId: validationSchemas.uuid,
  type: socketValidationSchemas.resourceType,
});
