import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import organizationValidationSchemas from '../../organizations/validation';
import {endpointValidationSchemas} from '../../validation';
import {INewBoardInput} from '../types';
import boardValidationSchemas from '../validation';
import {ICreateBoardParameters} from './types';

export const newBoardJoiSchema = Joi.object<INewBoardInput>().keys({
  name: organizationValidationSchemas.name.required(),
  description: organizationValidationSchemas.description.optional().allow(null),
  color: organizationValidationSchemas.color.required(),
  workspaceId: validationSchemas.resourceId.required(),
  boardStatuses: boardValidationSchemas.statusListSchema.required(),
  boardLabels: boardValidationSchemas.boardLabelList.required(),
  boardResolutions: boardValidationSchemas.boardResolutions.required(),
  visibility: endpointValidationSchemas.visibility,
});

export const addBoardJoiSchema = Joi.object<ICreateBoardParameters>()
  .keys({board: newBoardJoiSchema.required()})
  .required();
