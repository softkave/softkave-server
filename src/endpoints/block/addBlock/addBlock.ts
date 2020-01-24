import { IGetUserDataContext, IGetUserDataResult } from "./types";

const addBlockJoiSchema = Joi.object().keys({
  block: blockJoiSchema
});

export interface IAddBlockParameters {
  blockModel: BlockModel;
  user: IUserDocument;
  block: IBlockDocument;
  accessControlModel: AccessControlModel;
}

async function getUserData(
  context: IGetUserDataContext
): Promise<IGetUserDataResult> {
  let { block: validatedBlock } = validate({ block }, addBlockJoiSchema);

  if (validatedBlock.type === blockConstants.blockTypes.root) {
    throw blockError.invalidBlockType;
  }

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

export default getUserData;
