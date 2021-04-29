import { getPublicClientData } from "../../client/utils";
import { getPublicUserData } from "../utils";
import { GetUserDataEndpoint } from "./types";

const getUserData: GetUserDataEndpoint = async (context, instData) => {
    const user = await context.session.getUser(context, instData);
    const client = await context.client.getClientByUserId(
        context,
        user.customId
    );

    return {
        user: getPublicUserData(user),
        client: getPublicClientData(client),
    };
};

export default getUserData;
