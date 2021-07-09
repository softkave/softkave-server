import { getPublicOrgsArray } from "../utils";
import { GetUserOrgsEndpoint } from "./types";

const getUserOrgs: GetUserOrgsEndpoint = async (context, instData) => {
    const user = await context.session.getUser(context, instData);
    const orgs = await context.block.getUserOrgs(context, user);

    return {
        orgs: getPublicOrgsArray(orgs),
    };
};

export default getUserOrgs;
