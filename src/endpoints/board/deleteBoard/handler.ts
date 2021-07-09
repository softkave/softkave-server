import { validate } from "../../../utilities/joiUtils";
import canReadOrg from "../../org/canReadBlock";
import { fireAndForgetPromise } from "../../utils";
import { IBoard } from "../types";
import { DeleteBoardEndpoint } from "./types";
import { deleteBoardJoiSchema } from "./validation";

const deleteBoard: DeleteBoardEndpoint = async (context, instData) => {
    const data = validate(instData.data, deleteBoardJoiSchema);
    const user = await context.session.getUser(context, instData);
    const board = await context.block.assertGetBlockById<IBoard>(
        context,
        data.boardId
    );

    canReadOrg(board.parent, user);
    await context.block.deleteBlockAndChildren(context, board.customId);
    fireAndForgetPromise(
        context.sprint.deleteSprintByBoardId(context, board.customId)
    );
};

export default deleteBoard;
