import BlockModel from "../../mongo/block/BlockModel";
import NotificationModel from "../../mongo/notification/NotificationModel";
import UserModel from "../../mongo/user/UserModel";
import { IEndpointControllerProps } from "../controller";
import { wrapEndpoint } from "../utils";
import addBlock from "./addBlock/addBlock";
import AddBlockContext from "./addBlock/context";
import addCollaborators from "./addCollaborators/addCollaborators";
import AddCollaboratorsContext from "./addCollaborators/context";
import blockExists from "./blockExists/blockExists";
import BlockExistsContext from "./blockExists/context";
import DeleteBlockContext from "./deleteBlock/context";
import deleteBlock from "./deleteBlock/deleteBlock";
import GetAssignedTasksContext from "./getAssignedTasks/context";
import getAssignedTasks from "./getAssignedTasks/getAssignedTasks";
import GetBlockByIDContext from "./getBlockByID/context";
import getBlockByID from "./getBlockByID/getBlockByID";
import GetBlockChildrenContext from "./getBlockChildren/context";
import getBlockChildren from "./getBlockChildren/getBlockChildren";
import GetBlockCollaborationRequestsContext from "./getBlockCollaborationRequests/context";
import getBlockCollaborationRequests from "./getBlockCollaborationRequests/getBlockCollaborationRequests";
import GetBlockCollaboratorsContext from "./getBlockCollaborators/context";
import getBlockCollaborators from "./getBlockCollaborators/getBlockCollaborators";
import GetBlockLandingPageContext from "./getBlockLandingPage/context";
import getBlockLandingPage from "./getBlockLandingPage/handler";
import GetBlocksWithCustomIDsContext from "./getBlocksWithCustomIDs/context";
import getBlocksWithCustomIDs from "./getBlocksWithCustomIDs/getBlocksWithCustomIDs";
import GetRootBlocksContext from "./getRootBlocks/context";
import getRootBlocks from "./getRootBlocks/getRootBlocks";
import RemoveCollaboratorContext from "./removeCollaborator/context";
import removeCollaborator from "./removeCollaborator/removeCollaborator";
import RevokeCollaborationRequestsContext from "./revokeCollaborationRequests/context";
import revokeCollaborationRequests from "./revokeCollaborationRequests/revokeCollaborationRequests";
import TransferBlockContext from "./transferBlock/context";
import transferBlock from "./transferBlock/transferBlock";
import UpdateBlockContext from "./updateBlock/context";
import updateBlock from "./updateBlock/updateBlock";

export interface IBlockControllerProps {
  userModel: UserModel;
  blockModel: BlockModel;
  notificationModel: NotificationModel;
}

export default class BlockController {
  protected props: IEndpointControllerProps;

  constructor(props: IEndpointControllerProps) {
    this.props = props;
  }

  public addBlock(data, req) {
    return wrapEndpoint(data, req, () =>
      addBlock(
        new AddBlockContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public addCollaborators(data, req) {
    return wrapEndpoint(data, req, () =>
      addCollaborators(
        new AddCollaboratorsContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public blockExists(data, req) {
    return wrapEndpoint(data, req, () =>
      blockExists(
        new BlockExistsContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public deleteBlock(data, req) {
    return wrapEndpoint(data, req, () =>
      deleteBlock(
        new DeleteBlockContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public getRootBlocks(data, req) {
    return wrapEndpoint(data, req, () =>
      getRootBlocks(
        new GetRootBlocksContext({
          req,
          ...this.props
        })
      )
    );
  }

  public getAssignedTasks(data, req) {
    return wrapEndpoint(data, req, () =>
      getAssignedTasks(
        new GetAssignedTasksContext({
          req,
          ...this.props
        })
      )
    );
  }

  public getBlockByID(data, req) {
    return wrapEndpoint(data, req, () =>
      getBlockByID(
        new GetBlockByIDContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public getBlockChildren(data, req) {
    return wrapEndpoint(data, req, () =>
      getBlockChildren(
        new GetBlockChildrenContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public getBlockCollaborationRequests(data, req) {
    return wrapEndpoint(data, req, () =>
      getBlockCollaborationRequests(
        new GetBlockCollaborationRequestsContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public getBlockCollaborators(data, req) {
    return wrapEndpoint(data, req, () =>
      getBlockCollaborators(
        new GetBlockCollaboratorsContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public getBlocksWithCustomIDs(data, req) {
    return wrapEndpoint(data, req, () =>
      getBlocksWithCustomIDs(
        new GetBlocksWithCustomIDsContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public removeCollaborator(data, req) {
    return wrapEndpoint(data, req, () =>
      removeCollaborator(
        new RemoveCollaboratorContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public revokeCollaborationRequests(data, req) {
    return wrapEndpoint(data, req, () =>
      revokeCollaborationRequests(
        new RevokeCollaborationRequestsContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public transferBlock(data, req) {
    return wrapEndpoint(data, req, () =>
      transferBlock(
        new TransferBlockContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public updateBlock(data, req) {
    return wrapEndpoint(data, req, () =>
      updateBlock(
        new UpdateBlockContext({
          req,
          data,
          ...this.props
        })
      )
    );
  }

  public getBlockLandingPage(data, req) {
    return wrapEndpoint(data, req, () =>
      getBlockLandingPage(
        new GetBlockLandingPageContext({ req, data, ...this.props })
      )
    );
  }
}
