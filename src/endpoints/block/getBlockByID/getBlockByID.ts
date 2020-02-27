import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import { IGetBlockByIDContext, IGetBlockByIDResult } from "./types";
import { getBlockByIDJoiSchema } from "./validation";

async function getBlockByID(
  context: IGetBlockByIDContext
): Promise<IGetBlockByIDResult> {
  const data = validate(context.data, getBlockByIDJoiSchema);
  const block = await context.getBlockByID(data.customId);
  const user = await context.getUser();

  canReadBlock({ user, block });

  return { block };
}

export default getBlockByID;
