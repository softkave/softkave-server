import { BlockType } from "../../../mongo/block";
import { validate } from "../../../utilities/joiUtils";
import { OrganizationExistsEndpoint } from "./types";
import { organizationExistsJoiSchema } from "./validation";

const organizationExists: OrganizationExistsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, organizationExistsJoiSchema);
    const exists = await context.block.blockExists(
        context,
        data.name,
        BlockType.Organization
    );

    return { exists };
};

export default organizationExists;
