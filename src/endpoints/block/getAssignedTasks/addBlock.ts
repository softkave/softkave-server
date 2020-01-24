import { IGetUserDataContext, IGetUserDataResult } from "./types";

const addBlockJoiSchema = Joi.object().keys({
  block: blockJoiSchema
});

export interface IAddBlockParameters {
  blockModel: BlockModel;
  user: IUserDocument;
  block: IBlockDocument;
  accessControlModel: AccessControlModel;
}

async function getUserData(
  context: IGetUserDataContext
): Promise<IGetUserDataResult> {
  const blocks = await blockModel.model
    .find({
      ["taskCollaborators.userId"]: user.customId,
      type: blockConstants.blockTypes.task
    })
    .exec();

  return {
    blocks
  };
}

export default getUserData;
