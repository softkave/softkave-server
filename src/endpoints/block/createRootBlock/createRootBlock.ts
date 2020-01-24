import { IGetUserDataContext, IGetUserDataResult } from "./types";

async function getUserData(
  context: IGetUserDataContext
): Promise<IGetUserDataResult> {
  let rootBlock = {
    customId: uuid(),
    name: `root_${user.customId}`,
    createdAt: Date.now(),
    color: randomColor(),
    type: blockConstants.blockTypes.root,
    createdBy: user.customId
  };

  // TODO: redefine IBlock to make the non-required fields optional
  rootBlock = await addBlockTodDB({
    user,
    blockModel,
    block: rootBlock as IBlock
  });
  user.rootBlockId = rootBlock.customId;
  await user.save();

  return {
    block: rootBlock
  };
}

export default getUserData;
