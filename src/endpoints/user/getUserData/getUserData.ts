import { clientToClientUserView } from "../../client/utils";
import { fireAndForganizationetPromise } from "../../utils";
import { getPublicUserData } from "../utils";
import { GetUserDataEndpoint } from "./types";

const getUserData: GetUserDataEndpoint = async (context, instData) => {
    const user = await context.session.getUser(context, instData);
    const tokenData = await context.session.getTokenData(context, instData);
    const token = context.token.encodeToken(context, tokenData.customId);
    const client = await context.session.getClient(context, instData);

    fireAndForganizationetPromise(
        context.unseenChats.removeEntry(context, user.customId)
    );

    return {
        token,
        user: getPublicUserData(user),
        client: clientToClientUserView(client, user.customId),
    };
};

export default getUserData;
