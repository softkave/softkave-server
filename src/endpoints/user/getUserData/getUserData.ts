import getNewId from "../../../utilities/getNewId";
import { getPublicUserData } from "../utils";
import { GetUserDataEndpoint } from "./types";

const getUserData: GetUserDataEndpoint = async (context, instData) => {
    const user = await context.session.getUser(context, instData);

    return {
        user: getPublicUserData(user),
        clientId: getNewId(),
    };
};

export default getUserData;
