const {
  wrapField
} = require("../utils");
const addBlock = require("./addBlock");
const updateBlock = require("./updateBlock");
const deleteBlock = require("./deleteBlock");
const getBlockChildren = require("./getBlockChildren");
const getBlockCollaborators = require("./getBlockCollaborators");
const addCollaborators = require("./addCollaborators");
const updateCollaborator = require("./updateCollaborator");
const removeCollaborator = require("./removeCollaborator");
const getBlockCollabRequests = require("./getBlockCollabRequests");
const getBlocks = require("./getBlocks");
const getPermissionBlocks = require("./getPermissionBlocks");
const toggleTask = require("./toggleTask");
const updateRoles = require("./updateRoles");
const updateAcl = require("./updateAcl");
const blockSchema = require("./schema");

let blockHandlerGraphql = {
  addBlock: wrapField(addBlock),
  updateBlock: wrapField(updateBlock),
  deleteBlock: wrapField(deleteBlock),
  getBlocks: wrapField(getBlocks),
  getBlockChildren: wrapField(getBlockChildren),
  addCollaborators: wrapField(addCollaborators),
  updateCollaborator: wrapField(updateCollaborator),
  removeCollaborator: wrapField(removeCollaborator),
  getCollaborators: wrapField(getBlockCollaborators),
  getCollabRequests: wrapField(getBlockCollabRequests),
  getPermissionBlocks: wrapField(getPermissionBlocks),
  toggleTask: wrapField(toggleTask),
  updateRoles: wrapField(updateRoles),
  updateAcl: wrapFiled(updateAcl)
};

module.exports = {
  blockSchema,
  blockHandlerGraphql
};