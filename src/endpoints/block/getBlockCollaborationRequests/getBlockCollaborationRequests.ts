import { validate } from "utils/joiUtils";
import canReadBlock from "../canReadBlock";
import {
  IGetBlockCollaborationRequestsContext,
  IGetBlockCollaborationRequestsResult
} from "./types";
import { getBlockCollaborationRequestsJoiSchema } from "./validation";

async function getBlockCollaborationRequests(
  context: IGetBlockCollaborationRequestsContext
): Promise<IGetBlockCollaborationRequestsResult> {
  const data = validate(context.data, getBlockCollaborationRequestsJoiSchema);
  const user = await context.getUser();
  const block = await context.getBlockByID(data.customId);

  await canReadBlock({ user, block });

  const requests = await context.getCollaborationRequestsFromStorage(
    block.customId
  );

  return {
    requests
  };
}

export default getBlockCollaborationRequests;
