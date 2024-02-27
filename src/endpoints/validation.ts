import * as Joi from 'joi';
import { ResourceVisibilityMap } from '../models/resource';
import { SystemResourceType } from '../models/system';
import { mergeData } from '../utilities/fns';
import { endpointConstants } from './constants';

const systemResourceType = Joi.string().valid(...Object.values(SystemResourceType));
const page = Joi.number().integer();
const pageSize = Joi.number().integer();
const name = Joi.string().max(endpointConstants.nameLengthMax);
const description = Joi.string().max(endpointConstants.descriptionLengthMax).allow('');

const comparisonOps = (schema: Joi.Schema) => ({
  $eq: schema,
  $in: Joi.array().items(schema).max(endpointConstants.inputListMax),
  $ne: schema,
  $nin: Joi.array().items(schema).max(endpointConstants.inputListMax),
  $exists: Joi.boolean(),
  // we do not export $regex op
});

const numberLiteralOps = (schema: Joi.Schema) => ({
  $gt: schema,
  $gte: schema,
  $lt: schema,
  $lte: schema,
});

const fullLiteralOps = (schema: Joi.Schema) =>
  mergeData(numberLiteralOps(schema), comparisonOps(schema), {arrayUpdateStrategy: "replace"});

const objectOps = (schema: Joi.Schema) => ({
  $objMatch: schema,
});

const comparisonOpsSchema = (schema: Joi.Schema) =>
  Joi.object(comparisonOps(schema)).unknown(false);
const numberLiteralOpsSchema = (schema: Joi.Schema) =>
  Joi.object(numberLiteralOps(schema)).unknown(false);
const fullLiteralOpsSchema = (schema: Joi.Schema) =>
  Joi.object(fullLiteralOps(schema)).unknown(false);
const objectOpsSchema = (schema: Joi.Schema) => Joi.object(objectOps(schema)).unknown(false);

const arrayOps = (schema: Joi.Schema) => ({
  $size: Joi.number().integer(),
  $all: Joi.array().items(schema).max(endpointConstants.inputListMax),
  $elemMatch:
    schema.type === 'object'
      ? objectOpsSchema(schema)
      : schema.type === 'number'
      ? fullLiteralOpsSchema(schema)
      : comparisonOpsSchema(schema),
});

const arrayOpsSchema = (schema: Joi.Schema) => Joi.object(arrayOps(schema)).unknown(false);
const op = (schema: Joi.Schema) =>
  Joi.alternatives().try(
    schema,
    schema.type === 'array'
      ? arrayOpsSchema(schema)
      : schema.type === 'object'
      ? objectOpsSchema(schema)
      : schema.type === 'number'
      ? fullLiteralOpsSchema(schema)
      : comparisonOpsSchema(schema)
  );

const visibility = Joi.string().valid(...Object.values(ResourceVisibilityMap));

export const endpointValidationSchemas = {
  systemResourceType,
  page,
  pageSize,
  name,
  description,
  visibility,
  op,
  comparisonOps,
  numberLiteralOps,
  fullLiteralOps,
  objectOps,
  arrayOps,
  comparisonOpsSchema,
  numberLiteralOpsSchema,
  fullLiteralOpsSchema,
  objectOpsSchema,
  arrayOpsSchema,
};
