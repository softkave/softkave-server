import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import { BlockExistsEndpoint } from "./types";
import { blockExistsJoiSchema } from "./validation";

// TODO: Very Important: Check if the blocks or any other resource exists before performing
// operations on them
const blockExists: BlockExistsEndpoint = async (context, instData) => {
  const data = validate(instData.data, blockExistsJoiSchema);
  const user = await context.session.getUser(context.models, instData);
  const block = await context.block.getBlockByName(context.models, data.name);

  if (!block) {
    return false;
  }

  canReadBlock({ user, block });

  if (data.parent && data.parent !== block.parent) {
    return false;
  } else if (data.type && data.type !== block.type) {
    return false;
  }

  return true;
};

export default blockExists;
