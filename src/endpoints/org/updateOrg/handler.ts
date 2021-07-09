import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadOrg from "../canReadBlock";
import { OrgDoesNotExistError } from "../errors";
import { IOrganization } from "../types";
import { getPublicOrgData } from "../utils";
import { UpdateOrgEndpoint } from "./types";
import { updateBlockJoiSchema } from "./validation";

const updateOrg: UpdateOrgEndpoint = async (context, instData) => {
    const data = validate(instData.data, updateBlockJoiSchema);
    const user = await context.session.getUser(context, instData);
    const org = await context.block.assertGetBlockById<IOrganization>(
        context,
        data.orgId,
        () => {
            throw new OrgDoesNotExistError();
        }
    );

    canReadOrg(org.customId, user);

    const updatedOrg = await context.block.updateBlockById<IOrganization>(
        context,
        data.orgId,
        {
            ...data.data,
            updatedAt: getDate(),
            updatedBy: user.customId,
        }
    );

    return { org: getPublicOrgData(updatedOrg) };
};

export default updateOrg;
