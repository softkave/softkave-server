import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { GetRoomsEndpoint } from "./type";
import { getRoomsJoiSchema } from "./validation";

const getRooms: GetRoomsEndpoint = async (context, instaData) => {
    const user = await context.session.getUser(context, instaData);
    context.socket.assertSocket(instaData);
    const data = validate(instaData.data, getRoomsJoiSchema);
    const org = await context.block.getBlockById(context, data.orgId);

    canReadBlock({ user, block: org });

    const rooms = await context.chat.getRooms(
        context,
        data.orgId,
        user.customId
    );
    return rooms;
};

export default getRooms;
