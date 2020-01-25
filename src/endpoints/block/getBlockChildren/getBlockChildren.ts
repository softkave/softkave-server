import { validate } from "utils/joiUtils";
import { blockConstants } from "../constants";
import { IGetBlockChildrenContext, IGetBlockChildrenResult } from "./types";
import { getBlockChildrenJoiSchema } from "./validation";

async function getBlockChildren(
  context: IGetBlockChildrenContext
): Promise<IGetBlockChildrenResult> {
  const data = validate(context.data, getBlockChildrenJoiSchema);
  const typeList = Array.isArray(data.typeList)
    ? data.typeList
    : blockConstants.blockTypesArray;
  const blocks = await context.getBlockChildrenFromDatabase(
    data.blockID,
    typeList
  );

  return {
    blocks
  };
}

export default getBlockChildren;
