import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { notificationConstants } from "../../notifications/constants";
import { blockConstants } from "../constants";

const newCollaboratorSchema = Joi.object().keys({
    customId: validationSchemas.uuid.required(),
    email: Joi.string().required().trim().email().lowercase().required(),
    body: Joi.string()
        .max(notificationConstants.maxAddCollaboratorMessageLength)
        .allow([null, ""]),
    expiresAt: Joi.date().allow(null),
});

const newCollaboratorsListSchema = Joi.array()
    .items(newCollaboratorSchema)
    .max(blockConstants.maxAddCollaboratorValuesLength)
    .unique("email")
    .unique("customId");

export const addCollaboratorsJoiSchema = Joi.object().keys({
    blockId: validationSchemas.uuid.required(),
    collaborators: newCollaboratorsListSchema.required(),
});
