import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getOrganizationUnseenChatsCountJoiSchema = Joi.object()
  .keys({
    orgId: validationSchemas.uuid.required(),
  })
  .required();
