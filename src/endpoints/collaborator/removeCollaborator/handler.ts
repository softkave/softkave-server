import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import { IOrganization } from "../../organization/types";
import { throwOrganizationNotFoundError } from "../../organization/utils";
import { UserDoesNotExistError } from "../../user/errors";
import { RemoveCollaboratorEndpoint } from "./types";
import { removeCollaboratorJoiSchema } from "./validation";

const removeCollaborator: RemoveCollaboratorEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, removeCollaboratorJoiSchema);
    const user = await context.session.getUser(context, instData);
    const organization = await context.block.assertGetBlockById<IOrganization>(
        context,
        data.organizationId,
        throwOrganizationNotFoundError
    );

    canReadOrganization(organization.customId, user);

    const collaborator = await context.user.getUserById(
        context,
        data.collaboratorId
    );

    if (!collaborator) {
        throw new UserDoesNotExistError();
    }

    const collaboratorOrganizations = [...collaborator.organizations];
    const index = collaboratorOrganizations.findIndex(
        (o) => o.customId === o.customId
    );

    if (index === -1) {
        return;
    }

    collaboratorOrganizations.splice(index, 1);
    await context.user.updateUserById(context, collaborator.customId, {
        organizations: collaboratorOrganizations,
    });
};

export default removeCollaborator;
