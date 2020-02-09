import { validate } from "utils/joiUtils";
import { IGetBlockByIDContext, IGetBlockByIDResult } from "./types";
import { getBlockByIDJoiSchema } from "./validation";

async function getUserData(
  context: IGetBlockByIDContext
): Promise<IGetBlockByIDResult> {
  const data = validate(context.data, getBlockByIDJoiSchema);
  const block = await context.getBlockByID(data.customId);
  return { block };
}

export default getUserData;
