const { RequestError } = require("../../utils/error");
const {
  errorMessages: validationErrorMessages
} = require("../../utils/validationErrorMessages");
const {
  errorMessages: blockErrorMessages,
  errorFields: blockErrorFields
} = require("../../utils/blockErrorMessages");
const blockExists = require("./blockExists");
const { blockFieldNames } = require("./constants");
const { constants: mongoDBConstants } = require("../../mongo/constants");

async function addBlockToDb({ block, blockModel, user }) {
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
        }
      })
    ) {
      const blockExistsErrorMessageName = `${block.type}Name`;
      throw new RequestError(
        blockErrorFields,
        blockErrorMessages[blockExistsErrorMessageName]
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
      const blockExistsErrorMessageName = `${block.type}Name`;
      throw new RequestError(
        blockErrorFields,
        blockErrorMessages[blockExistsErrorMessageName]
      );
    }

    throw error;
  }
}

module.exports = addBlockToDb;
