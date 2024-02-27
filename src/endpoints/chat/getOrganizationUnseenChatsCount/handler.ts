import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {getCreateChatPermQueries} from '../permissionQueries';
import {GetOrganizationUnseenChatsCountEndpoint} from './type';
import {getOrganizationUnseenChatsCountJoiSchema} from './validation';

const getOrganizationUnseenChatsCount: GetOrganizationUnseenChatsCountEndpoint = async (ctx, d) => {
  const data = validate(d.data, getOrganizationUnseenChatsCountJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  ctx.socket.assertSocket(d);
  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: data.orgId,
    ...getCreateChatPermQueries(data.orgId),
  });

  const rooms = await ctx.chat.getRooms(ctx, user.customId, [data.orgId]);
  const counts = await Promise.all(
    rooms.map(room => {
      const {allow} = accessChecker.checkActionTarget(room);
      const memberData = room.members.find(member => member.userId === user.customId);
      return memberData && allow
        ? ctx.chat.getRoomChatsCount(ctx, room.customId, memberData.readCounter)
        : 0;
    })
  );

  const count = counts.reduce((acc, curr) => acc + curr, 0);
  return {count};
};

export default getOrganizationUnseenChatsCount;
