import { IGetRootBlocksContext, IGetRootBlocksResult } from "./types";

async function getRootBlocks(
  context: IGetRootBlocksContext
): Promise<IGetRootBlocksResult> {
  const blocks = await context.getRootBlocksFromStorage();

  return {
    blocks
  };
}

export default getRootBlocks;
