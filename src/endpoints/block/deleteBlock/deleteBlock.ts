import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import { DeleteBlockEndpoint } from "./types";
import { deleteBlockJoiSchema } from "./validation";

const deleteBlock: DeleteBlockEndpoint = async (context, instData) => {
  const data = validate(instData.data, deleteBlockJoiSchema);
  const user = await context.session.getUser(context.models, instData);
  const block = await context.block.getBlockById(context.models, data.customId);

  await canReadBlock({ user, block });
  await context.block.markBlockDeleted(context.models, block.customId, user);

  if (block.type === "org") {
    const userOrgIndex = user.orgs.findIndex(
      (org) => org.customId === block.customId
    );

    const userOrgs = [...user.orgs];
    userOrgs.splice(userOrgIndex, 1);

    // TODO: scrub user collection for unreferenced orgIds
    await context.session.updateUser(context.models, instData, {
      orgs: userOrgs,
    });
  }
};

export default deleteBlock;
