import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const fetchBroadcastsJoiSchema = Joi.object().keys({
  from: Joi.date().required(),
  rooms: Joi.array().items(validationSchemas.uuid).min(1).max(10).required(),
});
