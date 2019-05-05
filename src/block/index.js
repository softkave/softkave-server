const { wrapField } = require("../utils");
const addBlock = require("./addBlock");
const updateBlock = require("./updateBlock");
const deleteBlock = require("./deleteBlock");
const getBlockChildren = require("./getBlockChildren");
const getBlockCollaborators = require("./getBlockCollaborators");
const addCollaborators = require("./addCollaborators");
const removeCollaborator = require("./removeCollaborator");
const getBlockCollabRequests = require("./getBlockCollabRequests");
const getRoleBlocks = require("./getRoleBlocks");
const toggleTask = require("./toggleTask");
const revokeRequest = require("./revokeRequest");
const createRootBlock = require("./createRootBlock");
const blockSchema = require("./schema");

let blockHandlerGraphql = {
  addBlock: wrapField(addBlock),
  updateBlock: wrapField(updateBlock),
  deleteBlock: wrapField(deleteBlock),
  getBlockChildren: wrapField(getBlockChildren),
  addCollaborators: wrapField(addCollaborators),
  removeCollaborator: wrapField(removeCollaborator),
  getCollaborators: wrapField(getBlockCollaborators),
  getCollabRequests: wrapField(getBlockCollabRequests),
  getRoleBlocks: wrapField(getRoleBlocks),
  toggleTask: wrapField(toggleTask),
  revokeRequest: wrapField(revokeRequest),
  createRootBlock: wrapField(createRootBlock)
};

module.exports = {
  blockSchema,
  blockHandlerGraphql
};
