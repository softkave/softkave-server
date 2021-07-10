import { validate } from "../../../utilities/joiUtils";
import canReadOrg from "../../org/canReadBlock";
import { IOrganization } from "../../org/types";
import { throwOrgNotFoundError } from "../../org/utils";
import { UserDoesNotExistError } from "../../user/errors";
import { RemoveCollaboratorEndpoint } from "./types";
import { removeCollaboratorJoiSchema } from "./validation";

const removeCollaborator: RemoveCollaboratorEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, removeCollaboratorJoiSchema);
    const user = await context.session.getUser(context, instData);
    const org = await context.block.assertGetBlockById<IOrganization>(
        context,
        data.orgId,
        throwOrgNotFoundError
    );

    canReadOrg(org.customId, user);

    const collaborator = await context.user.getUserById(
        context,
        data.collaboratorId
    );

    if (!collaborator) {
        throw new UserDoesNotExistError();
    }

    const collaboratorOrgs = [...collaborator.orgs];
    const index = collaboratorOrgs.findIndex((o) => o.customId === o.customId);

    if (index === -1) {
        return;
    }

    collaboratorOrgs.splice(index, 1);
    await context.user.updateUserById(context, collaborator.customId, {
        orgs: collaboratorOrgs,
    });
};

export default removeCollaborator;
