import {
  IRespondToCollaborationRequestContext,
  IRespondToCollaborationRequestResult
} from "./types";
import { validate } from "utils/joiUtils";
import { respondToCollaborationRequestJoiSchema } from "./validation";
import notificationError from "utils/notificationError";
import { notificationConstants } from "endpoints/notification/constants";
import addOrgIDToUser from "../addOrgIDToUser";

async function respondToCollaborationRequest(
  context: IRespondToCollaborationRequestContext
): Promise<IRespondToCollaborationRequestResult> {
  const result = validate(context.data, respondToCollaborationRequestJoiSchema);

  const customId = result.customId;
  const email = context.data.user.email;
  const response = result.response;
  const user = context.data.user;

  const request = await context.addResponseToCollaborationRequestInDatabase(
    customId,
    email,
    response
  );

  if (!!!request) {
    throw notificationError.requestDoesNotExist;
  }

  if (
    response === notificationConstants.collaborationRequestStatusTypes.accepted
  ) {
    const block = await context.getBlockByID(request.from.blockId);

    await addOrgIDToUser({user,ID: block.customId});
    return{};
  }
}
