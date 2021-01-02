import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { blockConstants } from "../constants";

const newCollaboratorSchema = Joi.object().keys({
    customId: validationSchemas.uuid.required(),
    email: Joi.string().required().trim().email().lowercase().required(),
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
