import { getBaseContext } from "../contexts/BaseContext";
import { wrapEndpoint } from "../utils";
import addBlock from "./addBlock/addBlock";
import AddBlockContext from "./addBlock/context";
import addCollaborators from "./addCollaborators/addCollaborators";
import AddCollaboratorsContext from "./addCollaborators/context";
import blockExists from "./blockExists/blockExists";
import deleteBlock from "./deleteBlock/deleteBlock";
import getBlockChildren from "./getBlockChildren/getBlockChildren";
import getBlockCollaborators from "./getBlockCollaborators/getBlockCollaborators";
import getBlockNotifications from "./getBlockNotifications/getBlockNotifications";
import getUserRootBlocks from "./getUserRootBlocks/getUserRootBlocks";
import removeCollaborator from "./removeCollaborator/removeCollaborator";
import revokeCollaborationRequest from "./revokeCollaborationRequest/revokeCollaborationRequest";
import transferBlock from "./transferBlock/transferBlock";
import UpdateBlockContext from "./updateBlock/context";
import updateBlock from "./updateBlock/updateBlock";

export default class BlockController {
  public addBlock(data, req) {
    return wrapEndpoint(data, req, () =>
      addBlock(new AddBlockContext(), { req, data })
    );
  }

  public addCollaborators(data, req) {
    return wrapEndpoint(data, req, () =>
      addCollaborators(new AddCollaboratorsContext(), { req, data })
    );
  }

  public blockExists(data, req) {
    return wrapEndpoint(data, req, () =>
      blockExists(getBaseContext(), { req, data })
    );
  }

  public deleteBlock(data, req) {
    return wrapEndpoint(data, req, () =>
      deleteBlock(getBaseContext(), { req, data })
    );
  }

  public getUserRootBlocks(data, req) {
    return wrapEndpoint(data, req, () =>
      getUserRootBlocks(getBaseContext(), { req, data })
    );
  }

  public getBlockChildren(data, req) {
    return wrapEndpoint(data, req, () =>
      getBlockChildren(getBaseContext(), { data, req })
    );
  }

  public getBlockNotifications(data, req) {
    return wrapEndpoint(data, req, () =>
      getBlockNotifications(getBaseContext(), { req, data })
    );
  }

  public getBlockCollaborators(data, req) {
    return wrapEndpoint(data, req, () =>
      getBlockCollaborators(getBaseContext(), { req, data })
    );
  }

  public removeCollaborator(data, req) {
    return wrapEndpoint(data, req, () =>
      removeCollaborator(getBaseContext(), { req, data })
    );
  }

  public revokeCollaborationRequest(data, req) {
    return wrapEndpoint(data, req, () =>
      revokeCollaborationRequest(getBaseContext(), { req, data })
    );
  }

  public transferBlock(data, req) {
    return wrapEndpoint(data, req, () =>
      transferBlock(getBaseContext(), { req, data })
    );
  }

  public updateBlock(data, req) {
    return wrapEndpoint(data, req, () =>
      updateBlock(new UpdateBlockContext(), { req, data })
    );
  }
}

const controller: BlockController = new BlockController();

export function getBlockController() {
  return controller;
}
