import Joi from "joi";

const passwordPattern = /[A-Za-z0-9!()?_`~#$^&*+=]/;
const stringPattern = /^[\w ]*$/;
const hexColorPattern = /#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})\b/;

export const regEx = {
  passwordPattern,  
  stringPattern,
  hexColorPattern
};

const uuid = Joi.string()
  .guid()
  .trim();

const color = Joi.string()
  .trim()
  .lowercase()
  .regex(regEx.hexColorPattern);

export const validationSchemas = {
  uuid,
  color
};
