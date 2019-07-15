import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import BlockModel from "../../mongo/block/BlockModel";
import RequestError from "../../utils/RequestError";
import { validationErrorMessages } from "../../utils/validationError";
import addOrgIDToUser from "../user/addOrgIDToUser";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { CRUDActionsMap } from "./actions";
import addBlockToDB from "./addBlockToDB";
import { IBlockDocument } from "./block";
import blockError from "./blockError";
import canReadBlock from "./canReadBlock";
import { blockConstants, blockFieldNames } from "./constants";
import { blockHasParents, getImmediateParentID } from "./utils";
import { validateBlock } from "./validation";

export interface IAddBlockParameters {
  blockModel: BlockModel;
  user: IUserDocument;
  block: IBlockDocument;
  accessControlModel: AccessControlModel;
}

async function addBlock({
  blockModel,
  user,
  block,
  accessControlModel
}: IAddBlockParameters) {
  block = validateBlock(block);
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    CRUDActionName: CRUDActionsMap.CREATE
  });

  if (block.type === blockConstants.blockTypes.root) {
    throw blockError.invalidBlockType;
  }

  if (block.type === blockConstants.blockTypes.org) {
    const result = await addBlockToDB({ block, blockModel, user });

    // TODO: scrub for orgs that are not added to user and add or clean them
    // Continuation: you can do this when user tries to read them, or add them again
    await addOrgIDToUser({ user, ID: result.customId });
    return {
      block: result
    };
  }

  if (!blockHasParents(block)) {
    throw new RequestError(
      blockFieldNames.parents,
      validationErrorMessages.dataInvalid
    );
  }

  const rootParentId = block.parents[0];
  const rootParent = await blockModel.model
    .findOne({ customId: rootParentId })
    .lean()
    .exec();

  await canReadBlock({ user, block: rootParent });
  block = await addBlockToDB({ block, blockModel, user });
  const pluralizedType = `${block.type}s`;
  const update = {
    [pluralizedType]: block.customId
  };

  if (block.type === blockConstants.blockTypes.group) {
    update.groupTaskContext = block.customId;
    update.groupProjectContext = block.customId;
  }

  await blockModel.model
    .updateOne({ customId: getImmediateParentID(block) }, { $addToSet: update })
    .exec();

  return {
    block
  };
}

export default addBlock;
