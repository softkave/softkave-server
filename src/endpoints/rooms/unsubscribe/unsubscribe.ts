import { SystemResourceType } from "../../../models/system";
import { validate } from "../../../utilities/joiUtils";
import { SubscribeEndpoint } from "../subscribe/types";
import { subscribeJoiSchema } from "../subscribe/validation";

const unsubscribe: SubscribeEndpoint = async (context, instData) => {
    const data = validate(instData.data, subscribeJoiSchema);
    const user = await context.session.getUser(context, instData);

    context.socket.assertSocket(instData);

    const promises = data.items.map(async (dt) => {
        switch (dt.type) {
            // TODO: when the block is deleted, the block will not exist
            // causing an error and memory leak
            case SystemResourceType.Organization:
            case SystemResourceType.Board: {
                const block = await context.block.getBlockById(
                    context,
                    dt.customId
                );
                const roomName = context.room.getBlockRoomName(
                    block.type,
                    block.customId
                );

                context.room.leave(instData, roomName);
                break;
            }

            case SystemResourceType.Room: {
                const room = await context.chat.getRoomById(
                    context,
                    dt.customId
                );

                context.room.unSubscribeUser(context, room.name, user.customId);
                break;
            }
        }
    });

    await Promise.all(promises);
};

export default unsubscribe;
