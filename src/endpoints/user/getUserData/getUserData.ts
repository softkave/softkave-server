import { getPublicClientData } from "../../client/utils";
import { getPublicUserData } from "../utils";
import { GetUserDataEndpoint } from "./types";

const getUserData: GetUserDataEndpoint = async (context, instData) => {
    const user = await context.session.getUser(context, instData);
    const client = instData.client;

    return {
        user: getPublicUserData(user),
        client: getPublicClientData(client, user.customId),
    };
};

export default getUserData;
