import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import { GetBlockCollaboratorsEndpoint } from "./types";
import { getBlockCollaboratorsJoiSchema } from "./validation";

const getBlockCollaborators: GetBlockCollaboratorsEndpoint = async (
  context,
  instData
) => {
  const data = validate(instData.data, getBlockCollaboratorsJoiSchema);
  const user = await context.session.getUser(context, instData);
  const block = await context.block.getBlockById(context, data.blockId);

  canReadBlock({ user, block });

  const collaborators = await context.user.getBlockCollaborators(
    context,
    block.customId
  );

  return {
    collaborators,
  };
};

export default getBlockCollaborators;
