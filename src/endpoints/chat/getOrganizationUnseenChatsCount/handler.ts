import { validate } from "../../../utilities/joiUtils";
import { GetOrganizationUnseenChatsCountEndpoint } from "./type";
import { getOrganizationUnseenChatsCountJoiSchema } from "./validation";

const getOrganizationUnseenChatsCount: GetOrganizationUnseenChatsCountEndpoint =
  async (context, instData) => {
    const data = validate(
      instData.data,
      getOrganizationUnseenChatsCountJoiSchema
    );
    const user = await context.session.getUser(context, instData);
    context.socket.assertSocket(instData);
    const rooms = await context.chat.getRooms(context, user.customId, [
      data.orgId,
    ]);
    const counts = await Promise.all(
      rooms.map((room) => {
        const memberData = room.members.find(
          (member) => member.userId === user.customId
        );
        return memberData
          ? context.chat.getRoomChatsCount(
              context,
              room.customId,
              memberData.readCounter
            )
          : 0;
      })
    );
    const count = counts.reduce((acc, curr) => acc + curr, 0);
    return { count };
  };

export default getOrganizationUnseenChatsCount;
