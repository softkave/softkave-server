import Joi from "joi";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import { IBlockDocument } from "../../mongo/block";
import UserModel from "../../mongo/user/UserModel";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { CRUDActionsMap } from "./actions";

export interface IGetBlockCollaboratorsParameters {
  block: IBlockDocument;
  userModel: UserModel;
  user: IUserDocument;
  accessControlModel: AccessControlModel;
}

async function getBlockCollaborators({
  block,
  userModel,
  user,
  accessControlModel
}: IGetBlockCollaboratorsParameters) {
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
