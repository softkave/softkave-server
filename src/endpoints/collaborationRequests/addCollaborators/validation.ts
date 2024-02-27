import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import {collaborationRequestsConstants} from '../constants';

const newCollaboratorSchema = Joi.object().keys({
  email: Joi.string().required().trim().email().required(),
});

const newCollaboratorsListSchema = Joi.array()
  .items(newCollaboratorSchema)
  .max(collaborationRequestsConstants.maxAddCollaboratorValuesLength)
  .unique('email');

export const addCollaboratorsJoiSchema = Joi.object().keys({
  organizationId: validationSchemas.resourceId.required(),
  collaborators: newCollaboratorsListSchema.required(),
});
