import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import { IOrganization } from "../../organization/types";
import { getCollaboratorsArray } from "../../user/utils";
import { GetOrganizationCollaboratorsEndpoint } from "./types";
import { getOrganizationCollaboratorsJoiSchema } from "./validation";

const getOrganizationCollaborators: GetOrganizationCollaboratorsEndpoint =
    async (context, instData) => {
        const data = validate(
            instData.data,
            getOrganizationCollaboratorsJoiSchema
        );
        const user = await context.session.getUser(context, instData);
        const organization =
            await context.block.assertGetBlockById<IOrganization>(
                context,
                data.organizationId
            );

        canReadOrganization(organization.customId, user);

        const collaborators = await context.user.getBlockCollaborators(
            context,
            organization.customId
        );

        return {
            collaborators: getCollaboratorsArray(collaborators),
        };
    };

export default getOrganizationCollaborators;
