const addBlockToDb = require("./addBlockToDb");
const { RequestError } = require("../../utils/error");
const { errors: blockErrors } = require("../../utils/blockErrorMessages");
const {
  errorMessages: validationErrorMessages
} = require("../../utils/validationErrorMessages");
const canReadBlock = require("./canReadBlock");
const { validateBlock } = require("./validation");
const { blockHasParents, getImmediateParentId } = require("./utils");
const addOrgIdToUser = require("../user/addOrgIdToUser");
const { blockFieldNames, constants: blockConstants } = require("./constants");

async function addBlock({ blockModel, user, block }) {
  block = validateBlock(block);

  if (block.type === blockConstants.blockTypes.root) {
    throw blockErrors.invalidBlockType;
  }

  if (block.type === blockConstants.blockTypes.org) {
    let result = await addBlockToDb({ block, blockModel, user });

    // TODO: scrub for orgs that are not added to user and add or clean them
    // Continuation: you can do this when user tries to read them, or add them again
    await addOrgIdToUser({ user, id: result.customId });
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
  block = await addBlockToDb({ block, blockModel, user });
  const pluralizedType = `${block.type}s`;
  const update = {
    [pluralizedType]: block.customId
  };

  if (block.type === blockConstants.blockTypes.group) {
    update.groupTaskContext = block.customId;
    update.groupProjectContext = block.customId;
  }

  await blockModel.model
    .updateOne({ customId: getImmediateParentId(block) }, { $addToSet: update })
    .exec();

  return {
    block
  };
}

module.exports = addBlock;
