import { SystemActionType, SystemResourceType } from "../../../models/system";
import { validate } from "../../../utilities/joiUtils";
import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import canReadOrganization from "../../organization/canReadBlock";
import { IOrganization } from "../../organization/types";
import { throwOrganizationNotFoundError } from "../../organization/utils";
import outgoingEventFn from "../../socket/outgoingEventFn";
import { UserDoesNotExistError } from "../../user/errors";
import { RemoveCollaboratorEndpoint } from "./types";
import { removeCollaboratorJoiSchema } from "./validation";

const removeCollaborator: RemoveCollaboratorEndpoint = async (
  context,
  instData
) => {
  const data = validate(instData.data, removeCollaboratorJoiSchema);
  const user = await context.session.getUser(context, instData);
  const organization = await context.block.assertGetBlockById<IOrganization>(
    context,
    data.organizationId,
    throwOrganizationNotFoundError
  );

  canReadOrganization(organization.customId, user);
  const collaborator = await context.user.getUserById(
    context,
    data.collaboratorId
  );

  if (!collaborator) {
    throw new UserDoesNotExistError();
  }

  const collaboratorOrganizations = [...collaborator.orgs];
  const index = collaboratorOrganizations.findIndex(
    (o) => o.customId === o.customId
  );

  if (index === -1) {
    return;
  }

  collaboratorOrganizations.splice(index, 1);
  await context.user.updateUserById(context, collaborator.customId, {
    orgs: collaboratorOrganizations,
  });

  outgoingEventFn(
    context,
    SocketRoomNameHelpers.getUserRoomName(collaborator.customId),
    {
      actionType: SystemActionType.Delete,
      resourceType: SystemResourceType.Organization,
      resource: { customId: organization.customId },
    }
  );

  outgoingEventFn(
    context,
    SocketRoomNameHelpers.getOrganizationRoomName(organization.customId),
    {
      actionType: SystemActionType.Delete,
      resourceType: SystemResourceType.Collaborator,
      resource: { customId: collaborator.customId },
    }
  );
};

export default removeCollaborator;
