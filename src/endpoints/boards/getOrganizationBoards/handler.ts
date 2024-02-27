import {IBoard} from '../../../mongo/block/board';
import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {getReadOrgBoardsPermQueries} from '../permissionQueries';
import {getPublicBoardsArray} from '../utils';
import {GetOrganizationBoardsEndpoint} from './types';
import {getOrganizationBoardsJoiSchema} from './validation';

const getOrganizationBoards: GetOrganizationBoardsEndpoint = async (ctx, d) => {
  const data = validate(d.data, getOrganizationBoardsJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const qPerms = getReadOrgBoardsPermQueries(data.organizationId);
  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: data.organizationId,
    ...qPerms,
  });

  const [pBoards] = await Promise.allSettled([
    ctx.data.board.getManyByQuery(ctx, {workspaceId: data.organizationId}),
  ]);

  let fetchedBoards: IBoard[] = [];
  if (pBoards.status === 'fulfilled') {
    fetchedBoards = pBoards.value;
  } else {
    throw pBoards.reason;
  }

  const permittedBoards = fetchedBoards.filter((b, i) => {
    const {allow} = accessChecker.checkActionTarget(b);
    return allow;
  });

  return {boards: getPublicBoardsArray(permittedBoards)};
};

export default getOrganizationBoards;
