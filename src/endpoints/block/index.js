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
const { wrapGraphQLOperation, insertUserCredentials } = require("../utils");

class BlockOperations {
  constructor({ blockModel, notificationModel, userModel }) {
    const staticParams = {
      blockModel,
      notificationModel,
      userModel
    };
    const insertFuncs = [insertUserCredentials];

    this.addBlock = wrapGraphQLOperation(addBlock, staticParams, insertFuncs);
    this.updateBlock = wrapGraphQLOperation(
      updateBlock,
      staticParams,
      insertFuncs
    );
    this.deleteBlock = wrapGraphQLOperation(
      deleteBlock,
      staticParams,
      insertFuncs
    );
    this.getBlockChildren = wrapGraphQLOperation(
      getBlockChildren,
      staticParams,
      insertFuncs
    );
    this.addCollaborators = wrapGraphQLOperation(
      addCollaborators,
      staticParams,
      insertFuncs
    );
    this.removeCollaborator = wrapGraphQLOperation(
      removeCollaborator,
      staticParams,
      insertFuncs
    );
    this.getCollaborators = wrapGraphQLOperation(
      getBlockCollaborators,
      staticParams,
      insertFuncs
    );
    this.getCollabRequests = wrapGraphQLOperation(
      getBlockCollabRequests,
      staticParams,
      insertFuncs
    );
    this.getRoleBlocks = wrapGraphQLOperation(
      getRoleBlocks,
      staticParams,
      insertFuncs
    );
    this.toggleTask = wrapGraphQLOperation(
      toggleTask,
      staticParams,
      insertFuncs
    );
    this.revokeRequest = wrapGraphQLOperation(
      revokeRequest,
      staticParams,
      insertFuncs
    );
    this.createRootBlock = wrapGraphQLOperation(
      createRootBlock,
      staticParams,
      insertFuncs
    );
  }
}

module.exports = {
  blockSchema,
  BlockOperations
};
