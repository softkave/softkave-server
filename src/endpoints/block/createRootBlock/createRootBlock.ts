import randomColor from "randomcolor";
import uuid from "uuid/v4";
import { BlockType } from "../../../mongo/block";
import { INewBlockInput } from "../types";
import { CreateRootBlockEndpoint } from "./types";

const createRootBlock: CreateRootBlockEndpoint = async (context, instData) => {
  const user = await instData.data.user;
  const rootBlockInput: INewBlockInput = {
    customId: uuid(),
    name: `root_${user.customId}`,
    color: randomColor(),
    type: BlockType.Root,
  };

  const result = await context.addBlock(context, {
    ...instData,
    data: { block: rootBlockInput },
  });

  const rootBlock = result.block;

  // TODO: should we remove the user if the root block fails?
  await context.session.updateUser(context.models, instData, {
    rootBlockId: rootBlock.customId,
  });

  return {
    block: rootBlock,
  };
};

export default createRootBlock;
