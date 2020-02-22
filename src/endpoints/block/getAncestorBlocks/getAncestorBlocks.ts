import { IGetAncestorBlocksContext, IGetAncestorBlocksResult } from "./types";

async function getAncestorBlocks(
  context: IGetAncestorBlocksContext
): Promise<IGetAncestorBlocksResult> {
  const blocks = await context.getAncestorBlocksFromStorage();

  return {
    blocks
  };
}

export default getAncestorBlocks;
