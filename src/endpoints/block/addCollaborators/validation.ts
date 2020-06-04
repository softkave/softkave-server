import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { notificationConstants } from "../../notification/constants";
import { blockConstants } from "../constants";

const newCollaboratorSchema = Joi.object().keys({
  customId: validationSchemas.uuid,
  email: Joi.string().required().trim().email().lowercase(),
  body: Joi.string().max(notificationConstants.maxAddCollaboratorMessageLength),
  expiresAt: Joi.date(),
});

const newCollaboratorsListSchema = Joi.array()
  .items(newCollaboratorSchema)
  .max(blockConstants.maxAddCollaboratorValuesLength)
  .unique("email");

export const addCollaboratorsJoiSchema = Joi.object().keys({
  blockId: validationSchemas.uuid,
  collaborators: newCollaboratorsListSchema,
});
