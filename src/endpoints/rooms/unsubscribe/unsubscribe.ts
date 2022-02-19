import { SystemResourceType } from "../../../models/system";
import { validate } from "../../../utilities/joiUtils";
import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import { SubscribeEndpoint } from "../subscribe/types";
import { subscribeJoiSchema } from "../subscribe/validation";

const unsubscribe: SubscribeEndpoint = async (context, instData) => {
    const data = validate(instData.data, subscribeJoiSchema);
    await context.session.assertUser(context, instData);
    const socket = context.session.assertGetSocket(instData);
    let roomName = "";
    data.rooms.forEach((item) => {
        switch (item.type) {
            case SystemResourceType.Organization: {
                roomName = SocketRoomNameHelpers.getOrganizationRoomName(
                    item.customId
                );

                break;
            }

            case SystemResourceType.Board: {
                if (item.subRoom === SystemResourceType.Task) {
                    roomName = SocketRoomNameHelpers.getBoardTasksRoomName(
                        item.customId
                    );
                } else if (item.subRoom === SystemResourceType.Sprint) {
                    roomName = SocketRoomNameHelpers.getBoardSprintsRoomName(
                        item.customId
                    );
                } else {
                    roomName = SocketRoomNameHelpers.getBoardRoomName(
                        item.customId
                    );
                }

                break;
            }

            case SystemResourceType.Room: {
                roomName = SocketRoomNameHelpers.getChatRoomName(item.customId);
                break;
            }
        }

        if (roomName) {
            context.socketRooms.removeFromRoom(roomName, socket.id);
        }
    });
};

export default unsubscribe;
