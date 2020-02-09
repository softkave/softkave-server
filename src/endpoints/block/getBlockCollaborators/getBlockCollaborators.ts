import { validate } from "utils/joiUtils";
import canReadBlock from "../canReadBlock";
import {
  IGetBlockCollaboratorsContext,
  IGetBlockCollaboratorsResult
} from "./types";
import { getBlockCollaboratorsJoiSchema } from "./validation";

async function getBlockCollaborators(
  context: IGetBlockCollaboratorsContext
): Promise<IGetBlockCollaboratorsResult> {
  const data = validate(context.data, getBlockCollaboratorsJoiSchema);
  const user = await context.getUser();
  const block = await context.getBlockByID(data.customId);

  canReadBlock({ user, block });

  const collaborators = await context.getBlockCollaborators(block.customId);

  return {
    collaborators
  };
}

export default getBlockCollaborators;
