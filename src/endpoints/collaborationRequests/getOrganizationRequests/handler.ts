import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {assertOrganization} from '../../organizations/utils';
import {getReadOrgRequestsPermQueries} from '../permissionQueries';
import {getPublicCollaborationRequestArray} from '../utils';
import {GetBlockNotificationsEndpoint} from './types';
import {getOrganizationCollaborationRequestsJoiSchema} from './validation';

const getOrganizationRequests: GetBlockNotificationsEndpoint = async (ctx, d) => {
  const data = validate(d.data, getOrganizationCollaborationRequestsJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const organization = await ctx.data.workspace.getOneByQuery(ctx, {
    workspaceId: data.organizationId,
  });
  assertOrganization(organization);

  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: organization.customId,
    ...getReadOrgRequestsPermQueries(organization.customId),
  });

  const requests = await ctx.collaborationRequest.getCollaborationRequestsByBlockId(
    ctx,
    organization.customId
  );
  const permittedRequests = requests.filter(r => {
    const {allow} = accessChecker.checkActionTarget(r);
    return allow;
  });

  return {
    requests: getPublicCollaborationRequestArray(permittedRequests),
  };
};

export default getOrganizationRequests;
