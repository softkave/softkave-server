import { IGetAncestorBlocksContext, IGetAncestorBlocksResult } from "./types";

async function getUserData(
  context: IGetAncestorBlocksContext
): Promise<IGetAncestorBlocksResult> {
  const blocks = await context.getAncestorBlocksFromStorage();

  return {
    blocks
  };
}

export default getUserData;
