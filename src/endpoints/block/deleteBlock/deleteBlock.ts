import { IGetUserDataContext, IGetUserDataResult } from "./types";

async function getUserData(
  context: IGetUserDataContext
): Promise<IGetUserDataResult> {
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    CRUDActionName: CRUDActionsMap.DELETE
  });

  await blockModel.model
    .deleteMany({
      $or: [{ customId: block.customId }, { parents: block.customId }]
    })
    .exec();

  const pluralizedType = `${block.type}s`;
  const update = {
    [pluralizedType]: block.customId
  };

  if (block.type === blockConstants.blockTypes.group) {
    update.groupTaskContext = block.customId;
    update.groupProjectContext = block.customId;
  }

  // TODO: use bulk update or remove children id arrays entirely and figure out a new way to implement sorting
  await blockModel.model
    .updateOne(
      { customId: getImmediateParentID(block) },
      {
        $pull: update
      }
    )
    .exec();

  // TODO: scrub user collection for unreferenced orgIds
  await deleteOrgIDFromUser({ user, id: block.customId });
}

export default getUserData;
