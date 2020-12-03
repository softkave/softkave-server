import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import { BlockExistsEndpoint } from "./types";
import { blockExistsJoiSchema } from "./validation";

const getResourceSubscriptions: BlockExistsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, blockExistsJoiSchema);
    const user = await context.session.getUser(context, instData);

    if (data.parent) {
        const parent = await context.block.getBlockById(context, data.parent);
        canReadBlock({ user, block: parent });
    }

    const exists = await context.block.blockExists(
        context,
        data.name,
        data.type,
        data.parent
    );

    return { exists };
};

export default getResourceSubscriptions;
