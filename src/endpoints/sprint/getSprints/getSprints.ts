import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { GetSprintsEndpoint } from "./types";
import { getSprintsJoiSchema } from "./validation";

const getSprints: GetSprintsEndpoint = async (context, instData) => {
    const data = validate(instData.data, getSprintsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const block = await context.block.getBlockById(context, data.boardId);

    canReadBlock({ user, block });
};

export default getSprints;
