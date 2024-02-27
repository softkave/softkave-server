import {SystemActionType, SystemResourceType} from '../../../models/system';
import {getDateString} from '../../../utilities/fns';
import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import {assertOrganization} from '../../organizations/utils';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import {getCreateChatPermQueries} from '../permissionQueries';
import {assertChatRoom, getPublicRoomData} from '../utils';
import {UpdateRoomReadCounterEndpoint} from './type';
import {updateRoomReadCounterJoiSchema} from './validation';

const updateRoomReadCounter: UpdateRoomReadCounterEndpoint = async (ctx, d) => {
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  ctx.socket.assertSocket(d);
  const data = validate(d.data, updateRoomReadCounterJoiSchema);
  const organization = await ctx.data.workspace.getOneByQuery(ctx, {workspaceId: data.orgId});
  assertOrganization(organization);
  await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: data.orgId,
    ...getCreateChatPermQueries(data.orgId),
  });

  const currentRoomMemberData = await ctx.chat.getUserRoomReadCounter(
    ctx,
    user.customId,
    data.roomId
  );

  if (!currentRoomMemberData) {
    throw new Error();
  }

  const inputReadCounter = data.readCounter
    ? data.readCounter > Date.now()
      ? Date.now()
      : data.readCounter
    : Date.now();

  const readCounter = getDateString(inputReadCounter);
  const room = await ctx.chat.updateMemberReadCounter(ctx, data.roomId, user.customId, readCounter);
  assertChatRoom(room);
  const roomData = getPublicRoomData(room);
  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getUserRoomName(user.customId), {
    actionType: SystemActionType.Update,
    resourceType: SystemResourceType.ChatRoom,
    resource: roomData,
  });

  return {readCounter, room: roomData};
};

export default updateRoomReadCounter;
