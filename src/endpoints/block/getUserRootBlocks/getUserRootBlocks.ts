import { GetUserRootBlocksEndpoint } from "./types";

const getUserRootBlocks: GetUserRootBlocksEndpoint = async (
  context,
  instData
) => {
  const user = await context.session.getUser(context, instData);
  const blocks = await context.block.getUserRootBlocks(context, user);

  return {
    blocks,
  };
};

export default getUserRootBlocks;
