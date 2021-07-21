import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import { fireAndForganizationetPromise } from "../../utils";
import { IBoard } from "../types";
import { throwBoardNotFoundError } from "../utils";
import { DeleteBoardEndpoint } from "./types";
import { deleteBoardJoiSchema } from "./validation";

const deleteBoard: DeleteBoardEndpoint = async (context, instData) => {
    const data = validate(instData.data, deleteBoardJoiSchema);
    const user = await context.session.getUser(context, instData);
    const board = await context.block.assertGetBlockById<IBoard>(
        context,
        data.boardId,
        throwBoardNotFoundError
    );

    canReadOrganization(board.parent, user);
    await context.block.deleteBlockAndChildren(context, board.customId);
    fireAndForganizationetPromise(
        context.sprint.deleteSprintByBoardId(context, board.customId)
    );
};

export default deleteBoard;
