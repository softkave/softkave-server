import { IBlock } from "mongo/block";
import { validate } from "utils/joiUtils";
import canReadBlock from "../canReadBlock";
import { IDeleteBlockContext } from "./types";
import { deleteBlockJoiSchema } from "./validation";

async function getUserData(context: IDeleteBlockContext): Promise<void> {
  const data = validate(context.data, deleteBlockJoiSchema);
  const user = await context.getUser();
  const block = await context.getBlockByID(data.customId);

  await canReadBlock({ user, block });
  await context.deleteBlockChildrenInStorage(block.customId);

  // await blockModel.model
  //   .deleteMany({
  //     $or: [{ customId: block.customId }, { parents: block.customId }]
  //   })
  //   .exec();

  const immediateParentID = TODO;
  const parent = await context.getBlockByID(immediateParentID);
  const pluralizedType = `${block.type}s`;
  const typeContainer = parent[pluralizedType];
  const blockIndexInParent = typeContainer.indexOf(block.customId);

  typeContainer.splice(blockIndexInParent);

  const update: Partial<IBlock> = {
    [pluralizedType]: typeContainer
  };

  if (block.type === "group") {
    const groupTaskContext = parent.groupTaskContext;
    const groupProjectContext = parent.groupProjectContext;
    const blockIndexInGroupTaskContext = groupTaskContext.indexOf(
      block.customId
    );
    const blockIndexInGroupProjectContext = groupProjectContext.indexOf(
      block.customId
    );

    groupTaskContext.splice(blockIndexInGroupTaskContext, 1);
    groupProjectContext.splice(blockIndexInGroupProjectContext, 1);
  }

  await context.updateBlockByID(parent.customId, update);

  if (block.type === "org") {
    const orgIndex = user.orgs.indexOf(block.customId);
    const orgs = [...user.orgs];
    orgs.splice(orgIndex, 1);

    // TODO: scrub user collection for unreferenced orgIds
    // TODO: should this still be an error?
    await context.updateUser({ orgs });
  }

  await context.deleteBlockInStorage(block.customId);
}

export default getUserData;
