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
const transferBlock = require("./transferBlock");
const getBlock = require("./getBlock");
const blockSchema = require("./schema");
const { wrapGraphQLOperation, insertUserCredentials } = require("../utils");

async function getRequestBlock(arg) {
  const block = await getBlock({
    ...arg,
    isRequired: true,
    checkPermission: true
  });

  return {
    ...arg,
    block
  };
}

class BlockOperations {
  constructor(staticParams) {
    const defaultMiddlewares = [insertUserCredentials];
    const endpointsWithBlockParamMiddlewares = [
      ...defaultMiddlewares,
      getRequestBlock
    ];

    this.addBlock = wrapGraphQLOperation(
      addBlock,
      staticParams,
      defaultMiddlewares
    );

    this.updateBlock = wrapGraphQLOperation(
      updateBlock,
      staticParams,
      endpointsWithBlockParamMiddlewares
    );

    this.deleteBlock = wrapGraphQLOperation(
      deleteBlock,
      staticParams,
      endpointsWithBlockParamMiddlewares
    );

    this.getBlockChildren = wrapGraphQLOperation(
      getBlockChildren,
      staticParams,
      endpointsWithBlockParamMiddlewares
    );

    this.addCollaborators = wrapGraphQLOperation(
      addCollaborators,
      staticParams,
      endpointsWithBlockParamMiddlewares
    );

    this.removeCollaborator = wrapGraphQLOperation(
      removeCollaborator,
      staticParams,
      endpointsWithBlockParamMiddlewares
    );

    this.getCollaborators = wrapGraphQLOperation(
      getBlockCollaborators,
      staticParams,
      endpointsWithBlockParamMiddlewares
    );

    this.getCollabRequests = wrapGraphQLOperation(
      getBlockCollabRequests,
      staticParams,
      endpointsWithBlockParamMiddlewares
    );

    this.getRoleBlocks = wrapGraphQLOperation(
      getRoleBlocks,
      staticParams,
      defaultMiddlewares
    );

    this.toggleTask = wrapGraphQLOperation(
      toggleTask,
      staticParams,
      endpointsWithBlockParamMiddlewares
    );

    this.revokeRequest = wrapGraphQLOperation(
      revokeRequest,
      staticParams,
      endpointsWithBlockParamMiddlewares
    );

    this.createRootBlock = wrapGraphQLOperation(
      createRootBlock,
      staticParams,
      defaultMiddlewares
    );

    this.transferBlock = wrapGraphQLOperation(
      transferBlock,
      staticParams,
      defaultMiddlewares
    );
  }
}

module.exports = {
  blockSchema,
  BlockOperations
};
export {};
