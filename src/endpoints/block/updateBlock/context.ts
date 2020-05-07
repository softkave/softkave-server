import { IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import appInfo from "../../../res/appInfo";
import BaseEndpointContext, {
  IBaseEndpointContextParameters,
} from "../../BaseEndpointContext";
import TransferBlockContext from "../transferBlock/context";
import transferBlock from "../transferBlock/transferBlock";
import sendAssignedTaskEmailNotification from "./sendAssignedTaskEmailNotification";
import { IUpdateBlockContext, IUpdateBlockParameters } from "./types";

export interface IUpdateBlockContextParameters
  extends IBaseEndpointContextParameters {
  data: IUpdateBlockParameters;
}

export default class UpdateBlockContext extends BaseEndpointContext
  implements IUpdateBlockContext {
  public data: IUpdateBlockParameters;

  constructor(p: IUpdateBlockContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async transferBlock(
    block: IBlock,
    sourceBlockID: string,
    destinationBlockID: string
  ) {
    await transferBlock(
      new TransferBlockContext({
        blockModel: this.blockModel,
        notificationModel: this.notificationModel,
        userModel: this.userModel,
        req: this.req,
        data: {
          sourceBlock: sourceBlockID,
          draggedBlock: block.customId,
          destinationBlock: destinationBlockID,
        },
      })
    );
  }

  public async sendAssignedTaskEmailNotification(
    org: IBlock,
    task: IBlock,
    assigner: IUser,
    assignee: IUser
  ) {
    // console.log({ org, task, assigner, assignee });
    return sendAssignedTaskEmailNotification({
      email: assignee.email,
      senderOrg: org.name,
      assignee: assignee.name,
      assigner: assigner.name,
      loginLink: appInfo.loginLink,
      taskDescription: task.description,
    });
  }
}
