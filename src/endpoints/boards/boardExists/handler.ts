import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {getReadOrgBoardsPermQueries} from '../permissionQueries';
import {BoardExistsEndpoint} from './types';
import {boardExistsJoiSchema} from './validation';

const boardExists: BoardExistsEndpoint = async (ctx, d) => {
  const data = validate(d.data, boardExistsJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: data.parent,
    ...getReadOrgBoardsPermQueries(data.parent),
  });

  const exists = await ctx.data.board.existsByQuery(ctx, {
    name: {$regex: new RegExp(`^${data.name}$`, 'i')},
    workspaceId: data.parent,
  });
  return {exists};
};

export default boardExists;
