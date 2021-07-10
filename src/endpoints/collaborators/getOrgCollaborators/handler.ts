import { validate } from "../../../utilities/joiUtils";
import canReadOrg from "../../org/canReadBlock";
import { IOrganization } from "../../org/types";
import { getCollaboratorsArray } from "../../user/utils";
import { GetOrgCollaboratorsEndpoint } from "./types";
import { getOrgCollaboratorsJoiSchema } from "./validation";

const getOrgCollaborators: GetOrgCollaboratorsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, getOrgCollaboratorsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const org = await context.block.assertGetBlockById<IOrganization>(
        context,
        data.orgId
    );

    canReadOrg(org.customId, user);

    const collaborators = await context.user.getBlockCollaborators(
        context,
        org.customId
    );

    return {
        collaborators: getCollaboratorsArray(collaborators),
    };
};

export default getOrgCollaborators;
