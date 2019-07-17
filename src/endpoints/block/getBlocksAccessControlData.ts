import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { blockActionsMap } from "./actions";
import { IBlockDocument } from "./block";
import { getRootParentID } from "./utils";

export interface IGetBlockAccessControlDataParameters {
  block: IBlockDocument;
  user: IUserDocument;
  accessControlModel: AccessControlModel;
}

async function getBlockAccessControlData({
  block,
  user,
  accessControlModel
}: IGetBlockAccessControlDataParameters) {
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    actionName: blockActionsMap.READ_ORG
  });

  const query = { orgId: getRootParentID(block) };
  const roles = await accessControlModel.model.find(query).exec();

  return { roles };
}

export default getBlockAccessControlData;
