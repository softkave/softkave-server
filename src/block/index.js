const { wrapField } = require("../utils");
const addBlock = require("./addBlock");
const updateBlock = require("./updateBlock");
const deleteBlock = require("./deleteBlock");
const getPermissionBlocks = require("./getPermissionBlocks");
const getBlockChildren = require("./getBlockChildren");
const getBlockCollaborators = require("./getBlockCollaborators");
const addCollaborator = require("./addCollaborator");
const updateCollaborator = require("./updateCollaborator");
const removeCollaborator = require("./removeCollaborator");
const getBlockCollabRequests = require("./getBlockCollabRequests");
const blockSchema = require("./schema");

let blockHandlerGraphql = {
  addBlock: wrapField(addBlock),
  updateBlock: wrapField(updateBlock),
  deleteBlock: wrapField(deleteBlock),
  getPermissionBlocks: wrapField(getPermissionBlocks),
  getBlockChildren: wrapField(getBlockChildren),
  collaborator: {
    addCollaborator: wrapField(addCollaborator),
    updateCollaborator: wrapField(updateCollaborator),
    removeCollaborator: wrapField(removeCollaborator),
    getCollaborators: wrapField(getBlockCollaborators),
    getCollabRequests: wrapField(getBlockCollabRequests)
  }
};

module.exports = {
  blockSchema,
  blockHandlerGraphql
};
