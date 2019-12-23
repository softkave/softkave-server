import Joi from "joi";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import { IBlockDocument } from "../../mongo/block";
import { validate } from "../../utils/joi-utils";
import OperationError from "../../utils/OperationError";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { blockActionsMap } from "./actions";
import { blockErrorFields, blockErrorMessages } from "./blockError";
import { blockConstants } from "./constants";
import { accessControlArraySchema } from "./validation";

// TODO: define all any types
export interface IUpdateAccessControlDataParameters {
  block: IBlockDocument;
  user: IUserDocument;
  accessControlData: any;
  accessControlModel: AccessControlModel;
}

const updateAccessControlDataJoiSchema = Joi.object().keys({
  accessControlData: accessControlArraySchema
});

async function updateAccessControlData({
  block,
  user,
  accessControlData,
  accessControlModel
}: IUpdateAccessControlDataParameters) {
  const result = validate(
    { accessControlData },
    updateAccessControlDataJoiSchema
  );
  accessControlData = result.accessControlData;

  if (block.type !== blockConstants.blockTypes.org) {
    throw new OperationError(
      blockErrorFields.invalidOperation,
      blockErrorMessages.accessControlOnTypeOtherThanOrg
    );
  }

  // TODO: validate if the permitted roles exist in the block
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
