import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {getCreateChatPermQueries} from '../permissionQueries';
import {isUserPartOfRoom} from '../utils';
import {GetRoomsUnseenChatsCountEndpoint} from './type';
import {getRoomsUnseenChatsCountJoiSchema} from './validation';

const getRoomsUnseenChatsCount: GetRoomsUnseenChatsCountEndpoint = async (ctx, d) => {
  const data = validate(d.data, getRoomsUnseenChatsCountJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  ctx.socket.assertSocket(d);
  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: data.orgId,
    ...getCreateChatPermQueries(data.orgId),
  });

  const rooms = (await ctx.chat.getRoomsByIds(ctx, data.orgId, data.roomIds)).filter(room =>
    isUserPartOfRoom(room, user.customId)
  );

  const counts = (
    await Promise.all(
      rooms.map(room => {
        const {allow} = accessChecker.checkActionTarget(room);
        const memberData = room.members.find(member => member.userId === user.customId);
        return memberData && allow
          ? ctx.chat.getRoomChatsCount(ctx, room.customId, memberData.readCounter)
          : 0;
      })
    )
  ).map((count, index) => ({count, roomId: data.roomIds[index]}));
  return {counts};
};

export default getRoomsUnseenChatsCount;
