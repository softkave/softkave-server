import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';

export const getSprintsJoiSchema = Joi.object().keys({
  boardId: validationSchemas.resourceId.required(),
});
