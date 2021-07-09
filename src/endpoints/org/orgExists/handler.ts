import { BlockType } from "../../../mongo/block";
import { validate } from "../../../utilities/joiUtils";
import { OrgExistsEndpoint } from "./types";
import { orgExistsJoiSchema } from "./validation";

const orgExists: OrgExistsEndpoint = async (context, instData) => {
    const data = validate(instData.data, orgExistsJoiSchema);
    const exists = await context.block.blockExists(
        context,
        data.name,
        BlockType.Org
    );

    return { exists };
};

export default orgExists;
