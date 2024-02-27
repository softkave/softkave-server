import * as Joi from 'joi';
import {resourceTypeShortNameMaxLen} from '../models/system';

const passwordPattern = /[A-Za-z0-9!()?_`~#$^&*+=]/;
const stringPattern = /^[\w ]*$/;
const hexColorPattern = /^#[A-Za-z0-9]{3,8}$/;

export const regEx = {
  passwordPattern,
  stringPattern,
  hexColorPattern,
};

const resourceId = Joi.string()
  .regex(/[A-Za-z0-9_-]/)
  .trim()
  .max(
    /* short name length */ resourceTypeShortNameMaxLen +
      /* '_' separator length */ 1 +
      /* UUID v4 length is 32 */ 36
  );
const color = Joi.string().trim().regex(regEx.hexColorPattern);
const iso = Joi.date().iso();
const resourceIdList = Joi.array().items(resourceId).max(100);

export const validationSchemas = {
  color,
  iso,
  resourceId,
  resourceIdList,
};

export function stripOnEmpty(schema: Joi.Schema, fieldName: string) {
  return schema.when(fieldName, {
    is: Joi.valid(null),
    then: Joi.any().strip(),
  });
}

export function complexFieldJoiSchema(schema: Joi.Schema, max: number, uniqueIdField: string) {
  return Joi.object().keys({
    add: Joi.array().items(schema.required()).unique(uniqueIdField).max(max),
    update: Joi.array().items(schema.required()).unique(uniqueIdField).max(max),
    remove: Joi.array().items(validationSchemas.resourceId.required()).max(max),
  });
}
