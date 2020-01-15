import Joi from "joi";
import uniq from "lodash/uniq";
import { IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { validate } from "../../../utils/joiUtils";

// import BlockModel from "src/mongo/block/BlockModel";

export interface IGetBlocksWithCustomIDsProps {
  customIDs: string[];
  user: IUser;
}

export interface IGetBlocksWithCustomIDsOptions {
  dataProvider: IGetBlocksWithCustomIDsDataProvider;
}

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

export interface IGetBlocksWithCustomIDsDataProvider {
  getBlocksWithCustomIDs: (
    ids: string[],
    userOrgIDs: string[]
  ) => Promise<IBlock[]>;
}

class GetBlocksWithCustomIDsDataProvider
  implements IGetBlocksWithCustomIDsDataProvider {
  // private blockModel: BlockModel;

  public async getBlocksWithCustomIDs(ids: string[], userOrgIDs: string[]) {
    return [];
  }
}

export type GetBlocksWithCustomIDsIdentity = (
  props: IGetBlocksWithCustomIDsProps,
  options: IGetBlocksWithCustomIDsOptions
) => Promise<IBlock[]>;

const getBlocksWithCustomIDs: GetBlocksWithCustomIDsIdentity = async (
  props,
  options
) => {
  const result = validate(props, getBlocksWithCustomIDsJoiSchema);
  const blockCustomIDs = uniq(result.customIDs);
  const blocks = options.dataProvider.getBlocksWithCustomIDs(
    blockCustomIDs,
    result.user.orgs
  );

  return blocks;
};

export default getBlocksWithCustomIDs;
