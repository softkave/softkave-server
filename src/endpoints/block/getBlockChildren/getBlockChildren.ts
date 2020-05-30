import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import { GetBlockChildrenEndpoint } from "./types";
import { getBlockChildrenJoiSchema } from "./validation";

const getBlockChildren: GetBlockChildrenEndpoint = async (
  context,
  instData
) => {
  const data = validate(instData.data, getBlockChildrenJoiSchema);
  const user = await context.session.getUser(context.models, instData);
  const block = await context.block.getBlockById(context.models, data.customId);

  canReadBlock({ user, block });

  const blocks = await context.block.getBlockChildren(
    context.models,
    data.customId,
    data.typeList
  );

  return {
    blocks,
  };
};

export default getBlockChildren;
