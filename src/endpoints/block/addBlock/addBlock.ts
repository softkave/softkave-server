import { IBlock } from "mongo/block";
import { validate } from "utils/joiUtils";
import canReadBlock from "../canReadBlock";
import blockValidationSchemas from "../validation";
import { IAddBlockContext, IAddBlockResult } from "./types";

async function addBlock(context: IAddBlockContext): Promise<IAddBlockResult> {
  const data = validate(context.data, blockValidationSchemas.newBlock);
  const newBlock = data.block;
  const user = await context.getUser();

  if (newBlock.type === "org") {
    const org = await context.addBlockToStorage(newBlock);

    // TODO: scrub for orgs that are not added to user and add or clean them
    //    you can do this when user tries to read them, or add them again
    // TODO: scrub all data that failed it's pipeline

    if (user.orgs.includes(org.customId)) {
      const orgIDs = user.orgs.concat(org.customId);
      await context.updateUser({ orgs: orgIDs });
    } else {
      // TODO: should we log an error because it means the user already has the org
    }

    return {
      block: org
    };
  }

  const rootParentId = newBlock.parents;
  const rootParent = await context.getBlockByID(rootParentId);

  await canReadBlock({ user, block: rootParent });

  const block = await context.addBlockToStorage(newBlock);
  const pluralizedType = `${block.type}s`;
  const immediateParentID = TODO;
  const immediateParent: IBlock = TODO;

  // TODO: implement a more efficient way, like using $addToSet
  const update: Partial<IBlock> = {
    [pluralizedType]: [].concat(immediateParent[pluralizedType], block.customId)
  };

  if (block.type === "group") {
    update.groupTaskContext = immediateParent.groupTaskContext.concat(
      block.customId
    );
    update.groupProjectContext = immediateParent.groupProjectContext.concat(
      block.customId
    );
  }

  await context.updateBlockByID(immediateParent.customId, update);

  return {
    block
  };
}

export default addBlock;
