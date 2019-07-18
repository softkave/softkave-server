import Joi from "joi";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import BlockModel from "../../mongo/block/BlockModel";
import { validate } from "../../utils/joi-utils";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { CRUDActionsMap } from "./actions";
import { IBlockDocument } from "./block";
import { blockJoiSchema } from "./validation";

// TODO: define all any types
export interface IUpdateBlockParameters {
  block: IBlockDocument;
  data: any;
  blockModel: BlockModel;
  accessControlModel: AccessControlModel;
  user: IUserDocument;
}

const updateBlockJoiSchema = Joi.object().keys({
  data: blockJoiSchema
});

async function updateBlock({
  block,
  data,
  blockModel,
  accessControlModel,
  user
}: IUpdateBlockParameters) {
  const result = validate({ data }, updateBlockJoiSchema);
  data = result.data;
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    CRUDActionName: CRUDActionsMap.UPDATE
  });

  data.updatedAt = Date.now();
  await blockModel.model.updateOne(
    {
      customId: block.customId
    },
    data
  );
}

export default updateBlock;
