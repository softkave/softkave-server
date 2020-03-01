import randomColor from "randomcolor";
import uuid from "uuid/v4";
import { INewBlockInput } from "../types";
import { ICreateRootBlockContext, ICreateRootBlockResult } from "./types";

async function createRootBlock(
  context: ICreateRootBlockContext
): Promise<ICreateRootBlockResult> {
  const user = await context.data.user;
  const rootBlockInput: INewBlockInput = {
    customId: uuid(),
    name: `root_${user.customId}`,
    color: randomColor(),
    type: "root"
  };

  const rootBlock = await context.addBlockToStorage(rootBlockInput);

  // TODO: should we remove the user if the root block fails?
  await context.updateUser({ rootBlockId: rootBlock.customId });

  return {
    block: rootBlock
  };
}

export default createRootBlock;
