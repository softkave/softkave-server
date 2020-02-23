import { validate } from "utils/joiUtils";
import canReadBlock from "../canReadBlock";
import { IBlockExistsContext } from "./types";
import { blockExistsJoiSchema } from "./validation";

// TODO: Very Important: Check if the blocks or any other resource exists before performing
// operations on them

async function blockExists(context: IBlockExistsContext): Promise<boolean> {
  const result = validate(context.data, blockExistsJoiSchema);
  const user = await context.getUser();
  const block = await context.getBlockByName(result.name);

  if (!block) {
    return false;
  }

  canReadBlock({ user, block });

  if (result.parent && result.parent !== block.parent) {
    return false;
  } else if (result.type && result.type !== block.type) {
    return false;
  }

  return true;
}

export default blockExists;
