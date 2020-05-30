import { GetUserRootBlocksEndpoint } from "./types";

const getUserRootBlocks: GetUserRootBlocksEndpoint = async (
  context,
  instData
) => {
  const user = await context.session.getUser(context.models, instData);
  const blocks = await context.block.getUserRootBlocks(context.models, user);

  return {
    blocks,
  };
};

export default getUserRootBlocks;
