import { validate } from "../../../utilities/joiUtils";
import { notificationConstants } from "../../notification/constants";
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
    if (user.orgs.includes(ownerBlock.customId)) {
      const orgIDs = user.orgs.concat(ownerBlock.customId);
      await context.updateUser({ orgs: orgIDs });
    } else {
      // TODO: should we log an error because it means the user already has the org
    }
  }
}

export default respondToCollaborationRequest;
