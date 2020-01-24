import { IGetUserDataContext, IGetUserDataResult } from "./types";

// TODO: define all any parameters
export interface IGetBlockParameters {
  block: any;
  blockModel: BlockModel;
  isRequired?: boolean;
  checkPermission?: boolean;
  user: IUserDocument;
  accessControlModel: AccessControlModel;
}
async function getUserData(
  context: IGetUserDataContext
): Promise<IGetUserDataResult> {
  block = await blockModel.model.findOne({ customId: block.customId }).exec();

  if (!block && isRequired) {
    throw blockError.blockNotFound;
  }

  if (checkPermission && user) {
    await accessControlCheck({
      user,
      block,
      accessControlModel,
      CRUDActionName: CRUDActionsMap.READ
    });
  }

  return block;
}

export default getUserData;
