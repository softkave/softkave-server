import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {getCreateChatPermQueries} from '../permissionQueries';
import {getPublicRoomsArray} from '../utils';
import {GetRoomsEndpoint} from './type';
import {getRoomsJoiSchema} from './validation';

const getRooms: GetRoomsEndpoint = async (ctx, d) => {
  const data = validate(d.data, getRoomsJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  ctx.socket.assertSocket(d);
  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: data.orgId,
    ...getCreateChatPermQueries(data.orgId),
  });

  const rooms = await ctx.chat.getRooms(ctx, user.customId, [data.orgId]);
  const permittedRooms = rooms.filter(r => {
    const {allow} = accessChecker.checkActionTarget(r);
    return allow;
  });

  const publicRoomsData = getPublicRoomsArray(permittedRooms);
  return {
    rooms: publicRoomsData,
  };
};

export default getRooms;
