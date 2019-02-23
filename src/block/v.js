const joi = require("joi");
const isMongoId = require("validator/lib/isMongoId");
const isHexColor = require("validator/lib/isHexColor");
const { RequestError } = require("../error");

const blockParamInput = joi.object().keys({
  id: joi.string()
});

const block = joi.object().keys({
  name: joi.string(),
  description: joi.string(),
  expectedEndAt: joi.number(),
  completedAt: joi.number(),
  createdAt: joi.number(),
  color: joi.string(),
  updatedAt: joi.number(),
  type: joi.string(),
  parents: joi.array(),
  createdBy: joi.string(),
  taskCollaborators: joi.array(),
  acl: joi.array(),
  roles: joi.array(),
  priority: joi.string()
});

const block = joi.object().keys({
  name: joi.string(),
  description: joi.string(),
  expectedEndAt: joi.number(),
  completedAt: joi.number(),
  createdAt: joi.number(),
  color: joi.string(),
  updatedAt: joi.number(),
  type: joi.string(),
  parents: joi.array(),
  createdBy: joi.string(),
  taskCollaborators: joi.array(),
  acl: joi.array(),
  roles: joi.array(),
  priority: joi.string()
});
