import { SystemActionType, SystemResourceType } from "../../../models/system";
import { BlockType } from "../../../mongo/block";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import outgoingEventFn from "../../socket/outgoingEventFn";
import { OrganizationExistsError } from "../errors";
import { IOrganization } from "../types";
import { getPublicOrganizationData } from "../utils";
import { CreateOrganizationEndpoint } from "./types";
import { createOrganizationJoiSchema } from "./validation";

const createOrganization: CreateOrganizationEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, createOrganizationJoiSchema);
    let user = await context.session.getUser(context, instData);
    const organizationExists = await context.block.blockExists(
        context,
        data.organization.name,
        BlockType.Organization
    );

    if (organizationExists) {
        throw new OrganizationExistsError({
            field: "name",
        });
    }

    const organization: Omit<IOrganization, "customId"> = {
        createdBy: user.customId,
        createdAt: getDate(),
        type: BlockType.Organization,
        name: data.organization.name,
        description: data.organization.description,
        color: data.organization.color,
    };

    const savedOrganization = await context.block.saveBlock<IOrganization>(
        context,
        organization
    );

    // TODO: scrub for organizations that are not added to user and add or clean them
    //    you can do this when user tries to read them, or add them again
    // TODO: scrub all data that failed it's pipeline

    const userOrganizations = user.orgs.concat({
        customId: savedOrganization.customId,
    });

    user = await context.user.updateUserById(context, user.customId, {
        orgs: userOrganizations,
    });

    instData.user = user;
    const orgData = getPublicOrganizationData(savedOrganization);
    outgoingEventFn(
        context,
        SocketRoomNameHelpers.getUserRoomName(user.customId),
        {
            actionType: SystemActionType.Create,
            resourceType: SystemResourceType.Organization,
            resource: orgData,
        }
    );

    return {
        organization: orgData,
    };
};

export default createOrganization;
