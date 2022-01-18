import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../canReadBlock";
import { IOrganization } from "../types";
import {
    assertOrganization,
    getPublicOrganizationData,
    throwOrganizationNotFoundError,
} from "../utils";
import { UpdateOrganizationEndpoint } from "./types";
import { updateBlockJoiSchema } from "./validation";

const updateOrganization: UpdateOrganizationEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, updateBlockJoiSchema);
    const user = await context.session.getUser(context, instData);
    const organization = await context.block.assertGetBlockById<IOrganization>(
        context,
        data.organizationId,
        throwOrganizationNotFoundError
    );

    canReadOrganization(organization.customId, user);

    const updatedOrganization =
        await context.block.updateBlockById<IOrganization>(
            context,
            data.organizationId,
            {
                ...data.data,
                updatedAt: getDate(),
                updatedBy: user.customId,
            }
        );

    assertOrganization(updatedOrganization);
    return { organization: getPublicOrganizationData(updatedOrganization) };
};

export default updateOrganization;
