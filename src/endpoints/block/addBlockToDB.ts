import BlockModel from "../../mongo/block/BlockModel";
import mongoDBConstants from "../../mongo/constants";
import RequestError from "../../utils/RequestError";
import { validationErrorMessages } from "../../utils/validationError";
import { IUserDocument } from "../user/user";
import { IBlock, IBlockDocument } from "./block";
import { blockErrorFields, getBlockExistsErrorMessage } from "./blockError";
import blockExists from "./blockExists";
import { blockFieldNames } from "./constants";

export interface IAddBlockToDBParameters {
  block: IBlockDocument;
  blockModel: BlockModel;
  user: IUserDocument;
}

async function addBlockToDB({
  block,
  blockModel,
  user
}: IAddBlockToDBParameters) {
  try {
    if (!block.customId) {
      throw new RequestError(
        blockFieldNames.customId,
        validationErrorMessages.dataInvalid
      );
    }

    if (
      await blockExists({
        blockModel,
        block: {
          name: block.name,
          type: block.type,
          parents: block.parents
        } as IBlock
      })
    ) {
      throw new RequestError(
        blockErrorFields,
        getBlockExistsErrorMessage(block)
      );
    }

    block.createdBy = user.customId;
    block.createdAt = Date.now();
    let newBlock = new blockModel.model(block);
    newBlock = await newBlock.save();

    return newBlock;
  } catch (error) {
    if (error.code === mongoDBConstants.indexNotUniqueErrorCode) {
      console.log(`Block with same id - ${block.customId}`);

      throw new RequestError(
        blockErrorFields,
        getBlockExistsErrorMessage(block)
      );
    }

    throw error;
  }
}

export default addBlockToDB;
