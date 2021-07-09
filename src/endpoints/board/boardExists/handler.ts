import { BlockType } from "../../../mongo/block";
import { validate } from "../../../utilities/joiUtils";
import canReadOrg from "../../org/canReadBlock";
import { BoardExistsEndpoint } from "./types";
import { boardExistsJoiSchema } from "./validation";

const boardExists: BoardExistsEndpoint = async (context, instData) => {
    const data = validate(instData.data, boardExistsJoiSchema);
    const user = await context.session.getUser(context, instData);
    canReadOrg(data.parent, user);
    const exists = await context.block.blockExists(
        context,
        data.name,
        BlockType.Board,
        data.parent
    );

    return { exists };
};

export default boardExists;
