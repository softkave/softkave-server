import { BlockType } from "../../../mongo/block";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { OrgExistsError } from "../errors";
import { IOrganization } from "../types";
import { getPublicOrgData } from "../utils";
import { CreateOrgEndpoint } from "./types";
import { createOrgJoiSchema } from "./validation";

const createOrg: CreateOrgEndpoint = async (context, instData) => {
    const data = validate(instData.data, createOrgJoiSchema);
    let user = await context.session.getUser(context, instData);

    const orgExists = await context.block.blockExists(
        context,
        data.org.name,
        BlockType.Org
    );

    if (orgExists) {
        throw new OrgExistsError({
            field: "name",
        });
    }

    const org: Omit<IOrganization, "customId"> = {
        createdBy: user.customId,
        createdAt: getDate(),
        type: BlockType.Org,
        name: data.org.name,
        lowerCasedName: data.org.name.toLowerCase(),
        description: data.org.description,
        color: data.org.color,
    };

    const savedOrg = await context.block.saveBlock<IOrganization>(context, org);

    // TODO: scrub for orgs that are not added to user and add or clean them
    //    you can do this when user tries to read them, or add them again
    // TODO: scrub all data that failed it's pipeline

    const userOrgs = user.orgs.concat({ customId: savedOrg.customId });
    user = await context.user.updateUserById(context, user.customId, {
        orgs: userOrgs,
    });

    instData.user = user;
    return {
        org: getPublicOrgData(savedOrg),
    };
};

export default createOrg;
