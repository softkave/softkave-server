import BlockModel from "../mongo/block/BlockModel";
import LabelModel from "../mongo/label/LabelModel";
import NotificationModel from "../mongo/notification/NotificationModel";
import StatusModel from "../mongo/status/StatusModel";
import UserModel from "../mongo/user/UserModel";
import BlockController from "./block/controller";
import UserController from "./user/controller";

export interface IEndpointControllerProps {
  userModel: UserModel;
  blockModel: BlockModel;
  notificationModel: NotificationModel;
  statusModel: StatusModel;
  labelModel: LabelModel;
}

export default class EndpointController {
  public block: BlockController;
  public user: UserController;

  protected userModel: UserModel;
  protected blockModel: BlockModel;
  protected notificationModel: NotificationModel;
  protected statusModel: StatusModel;
  protected labelModel: LabelModel;

  constructor(props: IEndpointControllerProps) {
    this.blockModel = props.blockModel;
    this.notificationModel = props.notificationModel;
    this.userModel = props.userModel;
    this.statusModel = props.statusModel;
    this.labelModel = props.labelModel;

    this.block = new BlockController(props);
    this.user = new UserController(props);
  }
}
