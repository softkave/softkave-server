import BlockModel from "../mongo/block/BlockModel";
import NotificationModel from "../mongo/notification/NotificationModel";
import UserModel from "../mongo/user/UserModel";
import BlockController from "./block/controller";
import UserController from "./user/controller";

export interface IEndpointControllerProps {
  userModel: UserModel;
  blockModel: BlockModel;
  notificationModel: NotificationModel;
}

export default class EndpointController {
  public block: BlockController;
  public user: UserController;

  protected userModel: UserModel;
  protected blockModel: BlockModel;
  protected notificationModel: NotificationModel;

  constructor(props: IEndpointControllerProps) {
    this.blockModel = props.blockModel;
    this.notificationModel = props.notificationModel;
    this.userModel = props.userModel;

    this.block = new BlockController(props);
    this.user = new UserController(props);
  }
}
