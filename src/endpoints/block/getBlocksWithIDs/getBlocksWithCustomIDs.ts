import { validate } from "utils/joiUtils";
import {
  IGetBlocksWithCustomIDsContext,
  IGetBlocksWithCustomIDsResult
} from "./types";
import { getBlocksWithIDsJoiSchema } from "./validation";

async function getBlocksWithCustomIDs(
  context: IGetBlocksWithCustomIDsContext
): Promise<IGetBlocksWithCustomIDsResult> {
  const result = validate(context.data, getBlocksWithIDsJoiSchema);
  const blockCustomIDs = result.customIDs;
  const blocks = await context.getBlockListWithIDs(blockCustomIDs);

  return { blocks };
}

export default getBlocksWithCustomIDs;
