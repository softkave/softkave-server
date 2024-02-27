import {validate} from '../../../utilities/joiUtils';
import {getChatRoomAndCheckAccess, getPublicChatsArray} from '../utils';
import {GetRoomChatsEndpoint} from './type';
import {getRoomChatsJoiSchema} from './validation';

const getRoomChats: GetRoomChatsEndpoint = async (ctx, d) => {
  const data = validate(d.data, getRoomChatsJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  ctx.socket.assertSocket(d);
  const {room} = await getChatRoomAndCheckAccess(ctx, user, data.roomId);
  const chats = await ctx.chat.getMessages(ctx, [room.customId]);
  const publicChatsData = getPublicChatsArray(chats);

  return {
    chats: publicChatsData,
  };
};

export default getRoomChats;
