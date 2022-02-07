import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import { IBoard } from "../types";
import { getPublicBoardData, throwBoardNotFoundError } from "../utils";
import { GetBoardEndpoint } from "./types";
import { getBoardJoiSchema } from "./validation";

const getBoard: GetBoardEndpoint = async (context, instData) => {
    const data = validate(instData.data, getBoardJoiSchema);
    const user = await context.session.getUser(context, instData);
    const board = await context.block.assertGetBlockById<IBoard>(
        context,
        data.boardId,
        throwBoardNotFoundError
    );

    canReadOrganization(board.parent, user);
    return { board: getPublicBoardData(board) };
};

export default getBoard;
