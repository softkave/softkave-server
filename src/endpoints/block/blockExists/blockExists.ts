import { validate } from "utils/joiUtils";
import { IBlockExistsContext } from "./types";
import { blockExistsJoiSchema } from "./validation";

async function blockExists(context: IBlockExistsContext): Promise<boolean> {
  const result = validate(context.data, blockExistsJoiSchema);
  return context.doesBlockExistInStorage(result);
}

export default blockExists;
