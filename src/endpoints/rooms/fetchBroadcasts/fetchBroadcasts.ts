import { validate } from "../../../utilities/joiUtils";
import { FetchBroadcastsEndpoint } from "./types";
import { fetchBroadcastsJoiSchema } from "./validation";

const fetchBroadcasts: FetchBroadcastsEndpoint = async (context, instData) => {
    const data = validate(instData.data, fetchBroadcastsJoiSchema);

    // TODO: implement access control

    await context.session.assertUser(context, instData);
    context.socket.assertSocket(instData);

    return context.broadcastHistory.fetch(context, data.from, data.rooms);
};

export default fetchBroadcasts;
