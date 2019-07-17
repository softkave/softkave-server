import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import RequestError from "../../utils/RequestError";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { blockActionsMap } from "./actions";
import { IBlockDocument } from "./block";
import { blockErrorFields, blockErrorMessages } from "./blockError";
import { blockConstants } from "./constants";
import { validateAccessControlArray } from "./validation";

// TODO: define all any types
export interface IUpdateAccessControlDataParameters {
  block: IBlockDocument;
  user: IUserDocument;
  accessControlData: any;
  accessControlModel: AccessControlModel;
}

async function updateAccessControlData({
  block,
  user,
  accessControlData,
  accessControlModel
}: IUpdateAccessControlDataParameters) {
  if (block.type !== blockConstants.blockTypes.org) {
    throw new RequestError(
      blockErrorFields.invalidOperation,
      blockErrorMessages.accessControlOnTypeOtherThanOrg
    );
  }

  // TODO: validate if the permitted roles exist in the block
  validateAccessControlArray(accessControlData);
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    actionName: blockActionsMap.UPDATE_ROLES
  });

  /**
   * TODO: when a user is removed from an org, send a removed error, and show a notification modal,
   * prompt the user to respond, then remove or delete org from UI
   *
   * same when the user's access is revoked from some features
   *
   * maybe query or poll for role changes, or every query returns latest role data,
   * so that the UI can respond, or use websockets
   */

  await accessControlModel.model.deleteMany({ orgId: block.customId }).exec();
  await accessControlModel.model.insertMany(accessControlData);
}

export default updateAccessControlData;
