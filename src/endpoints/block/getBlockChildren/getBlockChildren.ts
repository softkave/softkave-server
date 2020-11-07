import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import { getPublicBlocksArray } from "../utils";
import { GetBlockChildrenEndpoint } from "./types";
import { getBlockChildrenJoiSchema } from "./validation";

const getBlockChildren: GetBlockChildrenEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, getBlockChildrenJoiSchema);
    const user = await context.session.getUser(context, instData);
    const block = await context.block.getBlockById(context, data.blockId);

    canReadBlock({ user, block });

    const blocks = await context.block.getBlockChildren(
        context,
        data.blockId,
        data.typeList
    );

    return {
        blocks: getPublicBlocksArray(blocks),
    };
};

export default getBlockChildren;
