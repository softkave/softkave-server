import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organizations/canReadBlock";
import { IOrganization } from "../../organizations/types";
import { throwOrganizationNotFoundError } from "../../organizations/utils";
import { getPublicCollaborationRequestArray } from "../utils";
import { GetBlockNotificationsEndpoint } from "./types";
import { getOrganizationCollaborationRequestsJoiSchema } from "./validation";

const getOrganizationRequests: GetBlockNotificationsEndpoint = async (
  context,
  instData
) => {
  const data = validate(
    instData.data,
    getOrganizationCollaborationRequestsJoiSchema
  );
  const user = await context.session.getUser(context, instData);
  const organization = await context.block.assertGetBlockById<IOrganization>(
    context,
    data.organizationId,
    throwOrganizationNotFoundError
  );

  await canReadOrganization(organization.customId, user);

  const requests =
    await context.collaborationRequest.getCollaborationRequestsByBlockId(
      context,
      organization.customId
    );

  return {
    requests: getPublicCollaborationRequestArray(requests),
  };
};

export default getOrganizationRequests;
