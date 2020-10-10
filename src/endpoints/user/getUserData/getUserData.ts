import getNewId from "../../../utilities/getNewId";
import { GetUserDataEndpoint } from "./types";

const getUserData: GetUserDataEndpoint = async (context, instData) => {
    const user = await context.session.getUser(context, instData);

    return {
        user,
        clientId: getNewId(),
    };
};

export default getUserData;
