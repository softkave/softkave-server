import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {assertOrganization} from '../../organizations/utils';
import {getReadCollaboratorsPermQueries} from '../permissionQueries';
import {getCollaboratorsArray} from '../utils';
import {GetOrganizationCollaboratorsEndpoint} from './types';
import {getOrganizationCollaboratorsJoiSchema} from './validation';

const getOrganizationCollaborators: GetOrganizationCollaboratorsEndpoint = async (ctx, d) => {
  const data = validate(d.data, getOrganizationCollaboratorsJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const organization = await ctx.data.workspace.getOneByQuery(ctx, {
    workspaceId: data.organizationId,
  });
  assertOrganization(organization);
  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: organization.customId,
    ...getReadCollaboratorsPermQueries(organization.customId),
  });

  const collaborators = await ctx.user.getBlockCollaborators(ctx, organization.customId);
  const permittedCollaborators = collaborators.filter(c => {
    const {allow} = accessChecker.checkActionTarget(c);
    return allow;
  });

  return {
    collaborators: getCollaboratorsArray(permittedCollaborators),
  };
};

export default getOrganizationCollaborators;
