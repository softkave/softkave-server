import * as Joi from 'joi';
import {complexFieldJoiSchema, validationSchemas} from '../../../utilities/validationUtils';
import organizationValidationSchemas from '../../organizations/validation';
import sprintValidationSchemas from '../../sprints/validation';
import {endpointValidationSchemas} from '../../validation';
import {boardConstants} from '../constants';
import boardValidationSchemas from '../validation';
import {IUpdateBoardInput, IUpdateBoardParameters} from './types';

export const updateBoardJoiSchema = Joi.object<IUpdateBoardParameters>()
  .keys({
    data: Joi.object<IUpdateBoardInput>()
      .keys({
        name: organizationValidationSchemas.name,
        description: organizationValidationSchemas.description.optional().allow(null),
        color: organizationValidationSchemas.color,
        boardStatuses: complexFieldJoiSchema(
          boardValidationSchemas.statusSchema,
          boardConstants.maxStatuses,
          'customId'
        ),
        boardLabels: complexFieldJoiSchema(
          boardValidationSchemas.labelSchema,
          boardConstants.maxLabels,
          'customId'
        ),
        boardResolutions: complexFieldJoiSchema(
          boardValidationSchemas.resolutionSchema,
          boardConstants.maxResolutions,
          'customId'
        ),
        sprintOptions: Joi.object().keys({
          duration: sprintValidationSchemas.sprintDuration,
        }),
        visibility: endpointValidationSchemas.visibility,
      })
      .required(),
    boardId: validationSchemas.resourceId.required(),
  })
  .required();
