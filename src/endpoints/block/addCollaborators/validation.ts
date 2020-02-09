import { notificationConstants } from "endpoints/notification/constants";
import Joi from "joi";
import { validationSchemas } from "utils/validationUtils";
import { blockConstants } from "../constants";

const newCollaboratorSchema = Joi.object().keys({
  email: Joi.string()
    .required()
    .trim()
    .email()
    .lowercase(),
  body: Joi.string()
    .min(notificationConstants.minAddCollaboratorMessageLength)
    .max(notificationConstants.maxAddCollaboratorMessageLength),
  expiresAt: Joi.number(),
  customId: validationSchemas.uuid
});

export const newCollaboratorsListSchema = Joi.array()
  .items(newCollaboratorSchema)
  .min(blockConstants.minAddCollaboratorValuesLength)
  .max(blockConstants.maxAddCollaboratorValuesLength)
  .unique("email");
