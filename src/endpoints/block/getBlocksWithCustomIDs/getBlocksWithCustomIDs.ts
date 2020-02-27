import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import {
  IGetBlocksWithCustomIDsContext,
  IGetBlocksWithCustomIDsResult
} from "./types";
import { getBlocksWithIDsJoiSchema } from "./validation";

async function getBlocksWithCustomIDs(
  context: IGetBlocksWithCustomIDsContext
): Promise<IGetBlocksWithCustomIDsResult> {
  const result = validate(context.data, getBlocksWithIDsJoiSchema);
  const blockCustomIDs = result.customIds;
  const user = await context.getUser();
  const blocks = await context.getBlockListWithIDs(blockCustomIDs);
  const permittedBlocks = blocks.filter(block => canReadBlock({ block, user }));

  return { blocks: permittedBlocks };
}

export default getBlocksWithCustomIDs;
