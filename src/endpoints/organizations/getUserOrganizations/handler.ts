import { getPublicOrganizationsArray } from "../utils";
import { GetUserOrganizationsEndpoint } from "./types";

const getUserOrganizations: GetUserOrganizationsEndpoint = async (
    context,
    instData
) => {
    const user = await context.session.getUser(context, instData);
    const organizations = await context.block.getUserOrganizations(
        context,
        user
    );

    return {
        organizations: getPublicOrganizationsArray(organizations),
    };
};

export default getUserOrganizations;
