import randomColor from "randomcolor";
import uuid from "uuid/v4";

import BlockModel from "../../mongo/block/BlockModel";
import addBlockTodDB from "../block/addBlockToDB";
import { IUserDocument } from "../user/user";
import { blockConstants } from "./constants";

export interface ICreateRootBlockParameters {
  user: IUserDocument;
  blockModel: BlockModel;
}

// TODO: look for users that have no root block and create one for them
async function createRootBlock({
  user,
  blockModel
}: ICreateRootBlockParameters) {
  let rootBlock = {
    customId: uuid(),
    name: `root_${user.customId}`,
    createdAt: Date.now(),
    color: randomColor(),
    type: blockConstants.blockTypes.root,
    createdBy: user.customId
  };

  rootBlock = await addBlockTodDB({ user, blockModel, block: rootBlock });
  user.rootBlockId = rootBlock.customId;
  await user.save();

  return {
    block: rootBlock
  };
}

export default createRootBlock;
