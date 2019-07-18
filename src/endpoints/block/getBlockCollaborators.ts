import Joi from "joi";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import UserModel from "../../mongo/user/UserModel";
import { validate } from "../../utils/joi-utils";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { CRUDActionsMap } from "./actions";
import { IBlockDocument } from "./block";
import { blockParamSchema } from "./validation";

export interface IGetBlockCollaboratorsParameters {
  block: IBlockDocument;
  userModel: UserModel;
  user: IUserDocument;
  accessControlModel: AccessControlModel;
}

const getBlockCollaboratorsJoiSchema = Joi.object().keys({});

async function getBlockCollaborators({
  block,
  userModel,
  user,
  accessControlModel
}: IGetBlockCollaboratorsParameters) {
  // const result = validate({ }, getBlockCollaboratorsJoiSchema);

  await accessControlCheck({
    user,
    block,
    accessControlModel,
    CRUDActionName: CRUDActionsMap.READ
  });

  const collaborators = await userModel.model
    .find(
      {
        orgs: block.customId
      },
      "name email createdAt customId"
    )
    .lean()
    .exec();

  return {
    collaborators
  };
}

export default getBlockCollaborators;
