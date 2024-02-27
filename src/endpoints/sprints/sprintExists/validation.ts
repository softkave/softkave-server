import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import sprintValidationSchemas from '../validation';

export const sprintExistsJoiSchema = Joi.object().keys({
  name: sprintValidationSchemas.name.required(),
  boardId: validationSchemas.resourceId.required(),
});
