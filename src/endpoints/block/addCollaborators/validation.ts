import { notificationConstants } from "../../notification/constants";
import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { blockConstants } from "../constants";

const newCollaboratorSchema = Joi.object().keys({
  customId: validationSchemas.uuid,
  email: Joi.string()
    .required()
    .trim()
    .email()
    .lowercase(),
  body: Joi.string()
    .min(notificationConstants.minAddCollaboratorMessageLength)
    .max(notificationConstants.maxAddCollaboratorMessageLength),
  expiresAt: Joi.number()
});

const newCollaboratorsListSchema = Joi.array()
  .items(newCollaboratorSchema)
  .min(blockConstants.minAddCollaboratorValuesLength)
  .max(blockConstants.maxAddCollaboratorValuesLength)
  .unique("email");

export const addCollaboratorsJoiSchema = Joi.object().keys({
  customId: validationSchemas.uuid,
  collaborators: newCollaboratorsListSchema
});
