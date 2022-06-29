import { SystemActionType, SystemResourceType } from "../../../models/system";
import { validate } from "../../../utilities/joiUtils";
import { clientToClientUserView } from "../../clients/utils";
import { getCollaboratorDataFromUser } from "../../collaborators/utils";
import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import outgoingEventFn from "../../socket/outgoingEventFn";
import { EmailAddressNotAvailableError } from "../errors";
import { getPublicUserData } from "../utils";
import { UpdateUserEndpoint } from "./types";
import { updateUserJoiSchema } from "./validation";

const updateUser: UpdateUserEndpoint = async (context, instData) => {
  const data = validate(instData.data, updateUserJoiSchema);
  const user = await context.session.getUser(context, instData);
  const incomingData = data.data;
  let updateChangesEmail = false;

  if (
    incomingData.email &&
    incomingData.email.toLowerCase() !== user.email.toLowerCase()
  ) {
    const userExists = await context.user.userExists(
      context,
      incomingData.email
    );

    if (userExists) {
      throw new EmailAddressNotAvailableError({ field: "email" });
    }

    updateChangesEmail = true;
  }

  const updatedUser = await context.user.updateUserById(
    context,
    user.customId,
    incomingData
  );

  // transfer collaboration requests to new email
  if (updateChangesEmail) {
    await context.collaborationRequest.changeRequestsRecipientEmail(
      context,
      user.email,
      incomingData.email
    );
  }

  instData.user = updatedUser;
  const tokenData = await context.session.getTokenData(context, instData);
  const client = await context.session.getClient(context, instData);
  const token = context.token.encodeToken(context, tokenData.customId);
  const userData = getPublicUserData(updatedUser);
  outgoingEventFn(
    context,
    SocketRoomNameHelpers.getUserRoomName(user.customId),
    {
      actionType: SystemActionType.Update,
      resourceType: SystemResourceType.User,
      resource: userData,
    }
  );

  const collaboratorData = getCollaboratorDataFromUser(updatedUser);
  updatedUser.orgs.forEach((org) => {
    outgoingEventFn(
      context,
      SocketRoomNameHelpers.getOrganizationRoomName(org.customId),
      {
        actionType: SystemActionType.Update,
        resourceType: SystemResourceType.Collaborator,
        resource: collaboratorData,
      }
    );
  });

  return {
    token,
    client: clientToClientUserView(client, user.customId),
    user: getPublicUserData(updatedUser),
  };
};

export default updateUser;
