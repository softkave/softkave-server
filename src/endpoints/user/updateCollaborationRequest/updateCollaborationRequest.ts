import { validate } from "../../../utilities/joiUtils";
import { IUpdateCollaborationRequestContext } from "./types";
import { updateCollaborationRequestSchema } from "./validation";

async function updateCollaborationRequest(
  context: IUpdateCollaborationRequestContext
): Promise<any> {
  const result = validate(context.data, updateCollaborationRequestSchema);

  const user = await context.getUser();
  const customId = result.customId;
  const email = user.email;
  const data = result.data;

  await context.updateNotificationInStorage(customId, email, data);
}

export default updateCollaborationRequest;
