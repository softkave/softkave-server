import { IGetUserDataContext, IGetUserDataResult } from "./types";

const getBlocksWithCustomIDsValidationConstants = {
  minCustomIDs: 1,
  maxCustomIDs: 100
};

const getBlocksWithCustomIDsJoiSchema = Joi.object().keys({
  customIDs: Joi.array()
    .items(Joi.string().uuid())
    .min(getBlocksWithCustomIDsValidationConstants.minCustomIDs)
    .max(getBlocksWithCustomIDsValidationConstants.maxCustomIDs)
});

export interface IGetBlocksWithCustomIDsParameters {
  user: IUserDocument;
  blockModel: BlockModel;
  customIDs: string[];
}

async function getUserData(
  context: IGetUserDataContext
): Promise<IGetUserDataResult> {
  const result = validate(
    { customIDs: props.customIDs },
    getBlocksWithCustomIDsJoiSchema
  );
  const blockCustomIDs = uniq(result.customIDs);
  const query = {
    customId: { $in: blockCustomIDs }
    // TODO: Look into fetching blocks for assigned tasks parents using the orgs and limiting the depth
    // or limiting the scope ( block type )
    // parents: { $in: props.user.orgs }
  };

  const blocks = await props.blockModel.model.find(query).exec();

  return { blocks };
}

export default getUserData;