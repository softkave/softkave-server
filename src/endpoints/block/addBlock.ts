import Joi from "joi";
import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import BlockModel from "../../mongo/block/BlockModel";
import { validate } from "../../utils/joi-utils";
import OperationError from "../../utils/OperationError";
import {
  validationErrorFields,
  validationErrorMessages
} from "../../utils/validationError";
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
import { blockJoiSchema, validateBlock } from "./validation";

const addBlockJoiSchema = Joi.object().keys({
  block: blockJoiSchema
});

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
  // block = validateBlock(block);
  let { block: validatedBlock } = validate({ block }, addBlockJoiSchema);

  if (validatedBlock.type === blockConstants.blockTypes.root) {
    throw blockError.invalidBlockType;
  }

  // if (validatedBlock.type !== blockConstants.blockTypes.org) {
  //   await accessControlCheck({
  //     user,
  //     block: validatedBlock,
  //     accessControlModel,
  //     CRUDActionName: CRUDActionsMap.CREATE
  //   });
  // }

  if (validatedBlock.type === blockConstants.blockTypes.org) {
    const result = await addBlockToDB({
      block: validatedBlock,
      blockModel,
      user
    });

    // TODO: scrub for orgs that are not added to user and add or clean them
    // Continuation: you can do this when user tries to read them, or add them again
    await addOrgIDToUser({ user, ID: result.customId });
    return {
      block: result
    };
  }

  if (!blockHasParents(validatedBlock)) {
    throw new OperationError(
      validationErrorFields.dataInvalid,
      validationErrorMessages.dataInvalid
      // blockFieldNames.parents
    );
  }

  const rootParentId = validatedBlock.parents[0];
  const rootParent = await blockModel.model
    .findOne({ customId: rootParentId })
    .lean()
    .exec();

  await canReadBlock({ user, block: rootParent });
  validatedBlock = await addBlockToDB({
    block: validatedBlock,
    blockModel,
    user
  });
  const pluralizedType = `${validatedBlock.type}s`;
  const update = {
    [pluralizedType]: validatedBlock.customId
  };

  if (validatedBlock.type === blockConstants.blockTypes.group) {
    update.groupTaskContext = validatedBlock.customId;
    update.groupProjectContext = validatedBlock.customId;
  }

  await blockModel.model
    .updateOne(
      { customId: getImmediateParentID(validatedBlock) },
      { $addToSet: update }
    )
    .exec();

  return {
    block: validatedBlock
  };
}

export default addBlock;
