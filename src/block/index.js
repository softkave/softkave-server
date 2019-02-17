const { wrapField } = require("../utils");
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
  getPermissionBlocks: wrapField(getPermissionBlocks)
};

module.exports = {
  blockSchema,
  blockHandlerGraphql
};
