import { IEndpointControllerProps } from "endpoints/controller";
import BlockModel from "mongo/block/BlockModel";
import NotificationModel from "mongo/notification/NotificationModel";
import UserModel from "mongo/user/UserModel";
import addBlock from "./addBlock/addBlock";
import AddBlockContext from "./addBlock/context";

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
    return addBlock(
      new AddBlockContext({
        req,
        data,
        ...this.props
      })
    );
  }
}
