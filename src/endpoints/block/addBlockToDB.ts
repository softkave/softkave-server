import { IBlock } from "../../mongo/block";
import BlockModel from "../../mongo/block/BlockModel";
import mongoDBConstants from "../../mongo/constants";
import OperationError from "../../utils/OperationError";
import {
  validationErrorFields,
  validationErrorMessages
} from "../../utils/validationError";
import { IUserDocument } from "../user/user";
import { blockErrorFields, getBlockExistsErrorMessage } from "./blockError";
import blockExists from "./blockExists";
import { blockFieldNames } from "./constants";

export interface IAddBlockToDBParameters {
  block: IBlock;
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
      throw new OperationError(
        validationErrorFields.dataInvalid,
        validationErrorMessages.dataInvalid
      );
    }

    if (block.type !== "task") {
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
        // TODO: replace the generic blockExists with the right type
        throw new OperationError(
          blockErrorFields.blockExists,
          getBlockExistsErrorMessage(block),
          `block.${blockFieldNames.name}`
        );
      }
    }

    block.createdBy = user.customId;
    block.createdAt = Date.now();

    // TODO: Think on, where is the right place to lowercase names?
    // Joi, logic or Mongo schema?
    block.lowerCasedName = block.name ? block.name.toLowerCase() : undefined;
    let newBlock = new blockModel.model(block);
    newBlock = await newBlock.save();

    return newBlock;
  } catch (error) {
    if (error.code === mongoDBConstants.indexNotUniqueErrorCode) {
      console.log(`Block with same id - ${block.customId}`);

      throw new OperationError(
        blockErrorFields.blockExists,
        getBlockExistsErrorMessage(block)
      );
    }

    throw error;
  }
}

export default addBlockToDB;
