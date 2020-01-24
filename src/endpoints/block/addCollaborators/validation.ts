import Joi from "joi";

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
  customId: joiSchemas.uuidSchema
});

// TODO: Implement test for unique items
const newCollaboratorsListSchema = Joi.array()
  .items(newCollaboratorSchema)
  .min(blockConstants.minAddCollaboratorValuesLength)
  .max(blockConstants.maxAddCollaboratorValuesLength);

export const getUserDataJoiSchema = Joi.object().keys({});
