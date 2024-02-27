import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import sprintValidationSchemas from '../validation';

export const addSprintJoiSchema = Joi.object().keys({
  boardId: validationSchemas.resourceId.required(),
  data: Joi.object()
    .keys({
      name: sprintValidationSchemas.name.required(),
      duration: sprintValidationSchemas.sprintDuration.required(),
    })
    .required(),
});
