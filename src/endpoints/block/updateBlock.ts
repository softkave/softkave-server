import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import BlockModel from "../../mongo/block/BlockModel";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { CRUDActionsMap } from "./actions";
import { IBlockDocument } from "./block";

// TODO: define all any types
export interface IUpdateBlockParameters {
  block: IBlockDocument;
  data: any;
  blockModel: BlockModel;
  accessControlModel: AccessControlModel;
  user: IUserDocument;
}

async function updateBlock({
  block,
  data,
  blockModel,
  accessControlModel,
  user
}: IUpdateBlockParameters) {
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
