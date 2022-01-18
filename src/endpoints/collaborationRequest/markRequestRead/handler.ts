import { getDate, getDateString, indexArray } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { PermissionDeniedError } from "../../errors";
import {
    IOutgoingMarkNotificationsReadPacket,
    OutgoingSocketEvents,
} from "../../socket/outgoingEventTypes";
import { MarkRequestReadEndpoint } from "./types";
import { markRequestReadJoiSchema } from "./validation";

const markRequestRead: MarkRequestReadEndpoint = async (context, instData) => {
    const data = validate(instData.data, markRequestReadJoiSchema);
    const user = await context.session.getUser(context, instData);
    const request =
        await context.collaborationRequest.assertGetCollaborationRequestById(
            context,
            data.requestId
        );

    if (request.to.email !== user.email) {
        throw new PermissionDeniedError();
    }

    await context.collaborationRequest.updateCollaborationRequestById(
        context,
        request.customId,
        {
            readAt: getDate(),
        }
    );

    const userRoomName = context.room.getUserRoomName(user.customId);

    // TODO: Fix
    // const updatePacket: IOutgoingMarkNotificationsReadPacket = {
    //     notifications: processedNotifications,
    // };

    // context.room.broadcast(
    //     context,
    //     instData,
    //     userRoomName,
    //     OutgoingSocketEvents.MarkNotificationsRead,
    //     updatePacket
    // );
};

export default markRequestRead;
