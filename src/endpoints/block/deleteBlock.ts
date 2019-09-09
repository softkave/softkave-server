import Joi from "joi";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import BlockModel from "../../mongo/block/BlockModel";
import { validate } from "../../utils/joi-utils";
import deleteOrgIDFromUser from "../user/deleteOrgIDFromUser";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { CRUDActionsMap } from "./actions";
import { IBlockDocument } from "./block";
import { blockConstants } from "./constants";
import { getImmediateParentID } from "./utils";
import { blockParamSchema } from "./validation";

export interface IDeleteBlockParameters {
  block: IBlockDocument;
  blockModel: BlockModel;
  user: IUserDocument;
  accessControlModel: AccessControlModel;
}

// const deleteBlockJoiSchema = Joi.object().keys({
// });

async function deleteBlock({
  block,
  blockModel,
  user,
  accessControlModel
}: IDeleteBlockParameters) {
  // const result = validate({  }, deleteBlockJoiSchema);

  await accessControlCheck({
    user,
    block,
    accessControlModel,
    CRUDActionName: CRUDActionsMap.DELETE
  });

  await blockModel.model
    .deleteMany({
      $or: [{ customId: block.customId }, { parents: block.customId }]
    })
    .exec();

  const pluralizedType = `${block.type}s`;
  const update = {
    [pluralizedType]: block.customId
  };

  if (block.type === blockConstants.blockTypes.group) {
    update.groupTaskContext = block.customId;
    update.groupProjectContext = block.customId;
  }

  await blockModel.model
    .updateOne(
      { customId: getImmediateParentID(block) },
      {
        $pull: update
      }
    )
    .exec();

  // TODO: scrub user collection for unreferenced orgIds
  await deleteOrgIDFromUser({ user, id: block.customId });
}

export default deleteBlock;