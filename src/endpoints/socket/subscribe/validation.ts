import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import socketValidationSchemas from "../validation";

export const subscribeJoiSchema = Joi.object().keys({
  id: validationSchemas.uuid,
  type: socketValidationSchemas.resourceType,
});
