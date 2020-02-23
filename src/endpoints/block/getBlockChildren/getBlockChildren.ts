import { validate } from "utils/joiUtils";
import canReadBlock from "../canReadBlock";
import { blockConstants } from "../constants";
import { IGetBlockChildrenContext, IGetBlockChildrenResult } from "./types";
import { getBlockChildrenJoiSchema } from "./validation";

async function getBlockChildren(
  context: IGetBlockChildrenContext
): Promise<IGetBlockChildrenResult> {
  const data = validate(context.data, getBlockChildrenJoiSchema);
  const user = await context.getUser();
  const block = await context.getBlockByID(data.customId);

  canReadBlock({ user, block });

  const typeList = Array.isArray(data.typeList)
    ? data.typeList
    : blockConstants.blockTypesArray;
  const blocks = await context.getBlockChildrenFromDatabase(
    data.customId,
    typeList
  );

  return {
    blocks
  };
}

export default getBlockChildren;
