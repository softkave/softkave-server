const addBlockToDB = require("./addBlockToDB");
const { RequestError } = require("../../utils/error");
const { blockErrors } = require("../../utils/blockError");
const { validationErrorMessages } = require("../../utils/validationError");
const canReadBlock = require("./canReadBlock");
const { validateBlock } = require("./validation");
const {
  blockHasParents,
  getImmediateParentID: getImmediateParentId
} = require("./utils");
const addOrgIDToUser = require("../user/addOrgIDToUser");
const { blockFieldNames, blockConstants } = require("./constants");
const accessControlCheck = require("./access-control-check");
const { CRUDActionsMap } = require("./actions");

async function addBlock({ blockModel, user, block, accessControlModel }) {
  block = validateBlock(block);
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    CRUDActionName: CRUDActionsMap.CREATE
  });

  if (block.type === blockConstants.blockTypes.root) {
    throw blockErrors.invalidBlockType;
  }

  if (block.type === blockConstants.blockTypes.org) {
    let result = await addBlockToDB({ block, blockModel, user });

    // TODO: scrub for orgs that are not added to user and add or clean them
    // Continuation: you can do this when user tries to read them, or add them again
    await addOrgIDToUser({ user, id: result.customId });
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
    .updateOne({ customId: getImmediateParentId(block) }, { $addToSet: update })
    .exec();

  return {
    block
  };
}

module.exports = addBlock;
export {};
