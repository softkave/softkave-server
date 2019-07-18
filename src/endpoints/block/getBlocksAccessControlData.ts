import Joi from "joi";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import { validate } from "../../utils/joi-utils";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { blockActionsMap } from "./actions";
import { IBlockDocument } from "./block";
import { getRootParentID } from "./utils";
import { blockParamSchema } from "./validation";

export interface IGetBlockAccessControlDataParameters {
  block: IBlockDocument;
  user: IUserDocument;
  accessControlModel: AccessControlModel;
}

const getBlockAccessControlDataJoiSchema = Joi.object().keys({});

async function getBlockAccessControlData({
  block,
  user,
  accessControlModel
}: IGetBlockAccessControlDataParameters) {
  // const result = validate({  }, getBlockAccessControlDataJoiSchema);

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
