import { SystemActionType, SystemResourceType } from "../../../models/system";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import { PermissionDeniedError } from "../../errors";
import outgoingEventFn from "../../socket/outgoingEventFn";
import { getPublicCollaborationRequest } from "../utils";
import { MarkRequestReadEndpoint } from "./types";
import { markRequestReadJoiSchema } from "./validation";

const markRequestRead: MarkRequestReadEndpoint = async (context, instData) => {
    const data = validate(instData.data, markRequestReadJoiSchema);
    const user = await context.session.getUser(context, instData);
    let request =
        await context.collaborationRequest.assertGetCollaborationRequestById(
            context,
            data.requestId
        );

    if (request.to.email !== user.email) {
        throw new PermissionDeniedError();
    }

    request = await context.collaborationRequest.updateCollaborationRequestById(
        context,
        request.customId,
        {
            readAt: getDate(),
        }
    );

    const requestData = getPublicCollaborationRequest(request);
    outgoingEventFn(
        context,
        SocketRoomNameHelpers.getUserRoomName(user.customId),
        {
            actionType: SystemActionType.Update,
            resourceType: SystemResourceType.CollaborationRequest,
            resource: requestData,
        }
    );

    return { request: requestData };
};

export default markRequestRead;
