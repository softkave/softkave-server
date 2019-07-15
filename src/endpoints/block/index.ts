import { IBaseOperationParameters } from "..";
import { IUser } from "../user/user";
import { insertUserCredentials, wrapGraphQLOperation } from "../utils";
import addBlock from "./addBlock";
import addCollaborators from "./addCollaborators";
import assignRole from "./assignRole";
import { IBlock } from "./block";
import createRootBlock from "./createRootBlock";
import deleteBlock from "./deleteBlock";
import getBlock from "./getBlock";
import getBlockChildren from "./getBlockChildren";
import getBlockCollaborators from "./getBlockCollaborators";
import getBlockCollabRequests from "./getBlockCollabRequests";
import getRoleBlocks from "./getRoleBlocks";
import removeCollaborator from "./removeCollaborator";
import revokeRequest from "./revokeRequest";
import blockSchema from "./schema";
import toggleTask from "./toggleTask";
import transferBlock from "./transferBlock";
import updateAccessControlData from "./updateAccessControlData";
import updateBlock from "./updateBlock";
import updateRoles from "./updateRoles";

export interface IBlockOperationParameters extends IBaseOperationParameters {
  user: IUser;
  block: IBlock;
}

async function getRequestBlock(arg: any) {
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

    this.updateAccessControlData = wrapGraphQLOperation(
      updateAccessControlData,
      staticParams,
      endpointsWithBlockParamMiddlewares
    );

    this.assignRole = wrapGraphQLOperation(
      assignRole,
      staticParams,
      endpointsWithBlockParamMiddlewares
    );

    this.updateRoles = wrapGraphQLOperation(
      updateRoles,
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
