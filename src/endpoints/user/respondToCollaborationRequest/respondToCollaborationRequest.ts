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
  const customId = data.customId;
  const email = user.email;
  const response = data.response;
  const request = await context.addResponseToCollaborationRequestToStorage(
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
    // TODO: should we log something here?
    // TODO: figure our log points, i.e, what are the things we should be logging?
    await context.deleteCollaborationRequestInStorage(request.customId);
  } else if (
    response === notificationConstants.collaborationRequestStatusTypes.accepted
  ) {
    await context.addOrgToUser(ownerBlock.customId, user.customId);
  }
}

export default respondToCollaborationRequest;
