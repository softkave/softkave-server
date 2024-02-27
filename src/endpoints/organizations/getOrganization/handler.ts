import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {getReadOrgPermQueries} from '../permissionQueries';
import {assertOrganization, getPublicOrganizationData} from '../utils';
import {GetOrganizationEndpoint} from './types';
import {getOrganizationJoiSchema} from './validation';

const getOrganization: GetOrganizationEndpoint = async (ctx, d) => {
  const data = validate(d.data, getOrganizationJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: data.organizationId,
    ...getReadOrgPermQueries(data.organizationId),
  });

  const org = await ctx.data.workspace.getOneByQuery(ctx, {customId: data.organizationId});
  assertOrganization(org);

  return {organization: getPublicOrganizationData(org)};
};

export default getOrganization;
