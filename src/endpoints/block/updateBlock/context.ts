import { IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import appInfo from "../../../res/appInfo";
import BaseContext from "../../contexts/BaseContext";
import transferBlock from "../transferBlock/transferBlock";
import sendAssignedTaskEmailNotification from "./sendAssignedTaskEmailNotification";
import { IUpdateBlockContext } from "./types";

export default class UpdateBlockContext extends BaseContext
  implements IUpdateBlockContext {
  public async transferBlock(context, instData) {
    await transferBlock(context, instData);
  }

  public async sendAssignedTaskEmailNotification(
    org: IBlock,
    taskDescription: string,
    assigner: IUser,
    assignee: IUser
  ) {
    // console.log({ org, task, assigner, assignee });
    return (sendAssignedTaskEmailNotification({
      taskDescription,
      email: assignee.email,
      senderOrg: org.name,
      assignee: assignee.name,
      assigner: assigner.name,
      loginLink: appInfo.loginLink,
    }) as unknown) as any;
  }
}
