import {IWorkspace} from '../../../mongo/block/workspace';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {getReadOrgPermQueries} from '../permissionQueries';
import {getPublicOrganizationsArray} from '../utils';
import {GetUserOrganizationsEndpoint} from './types';

const getUserOrganizations: GetUserOrganizationsEndpoint = async (ctx, d) => {
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const organizationIds = user.workspaces.map(item => item.customId);
  const [orgsP] = await Promise.allSettled([
    ctx.data.workspace.getManyByQuery(ctx, {customId: {$in: organizationIds}}),
  ]);

  let organizations: IWorkspace[] = [];
  if (orgsP.status === 'fulfilled') {
    organizations = orgsP.value;
  } else {
    throw orgsP.reason;
  }

  // TODO: can we bulk check in one async call?
  const accessCheckers = await Promise.allSettled(
    organizations.map(org =>
      getCheckAuthorizationChecker({
        ctx,
        user,
        orgId: org.customId,
        nothrow: true,
        ...getReadOrgPermQueries(org.customId),
      })
    )
  );

  const permittedOrgs = organizations.filter((org, i) => {
    const checker = accessCheckers[i];
    if (checker.status === 'fulfilled' && checker.value) {
      const {allow} = checker.value.checkActionTarget(org);
      return allow;
    }
    return false;
  });

  return {organizations: getPublicOrganizationsArray(permittedOrgs)};
};

export default getUserOrganizations;
