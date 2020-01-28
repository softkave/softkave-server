import { notificationConstants } from "endpoints/notification/constants";
import { validate } from "utils/joiUtils";
import { CollaborationRequestDoesNotExistError } from "../errors";
import { IRespondToCollaborationRequestContext } from "./types";
import { respondToCollaborationRequestJoiSchema } from "./validation";

async function respondToCollaborationRequest(
  context: IRespondToCollaborationRequestContext
): Promise<void> {
  const data = validate(context.data, respondToCollaborationRequestJoiSchema);
  const user = await context.getUser();
  const customId = data.requestID;
  const email = user.email;
  const response = data.response;
  const request = await context.addResponseToCollaborationRequestInDatabase(
    customId,
    email,
    response
  );

  if (!!!request) {
    throw new CollaborationRequestDoesNotExistError();
  }

  const ownerBlock = await context.getBlockByID(request.from.blockId);

  if (!ownerBlock) {
    // if the org does not exist or has been deleted
    await context.deleteCollaborationRequestInDatabase(request.customId);
  } else if (
    response === notificationConstants.collaborationRequestStatusTypes.accepted
  ) {
    await context.addOrgToUser(ownerBlock.customId, user.customId);
  }
}

export default respondToCollaborationRequest;
