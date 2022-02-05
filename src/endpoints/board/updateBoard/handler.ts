import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import { fireAndForgetPromise } from "../../utils";
import { IBoard } from "../types";
import {
    assertBoard,
    getPublicBoardData,
    throwBoardNotFoundError,
} from "../utils";
import persistBoardLabelChanges from "./persistBoardLabelChanges";
import persistBoardResolutionsChanges from "./persistBoardResolutionsChanges";
import persistBoardStatusChanges from "./persistBoardStatusChanges";
import processUpdateBoardInput from "./processUpdateBoardInput";
import { UpdateBoardEndpoint } from "./types";
import { updateBoardJoiSchema } from "./validation";

const updateBoard: UpdateBoardEndpoint = async (context, instData) => {
    const data = validate(instData.data, updateBoardJoiSchema);
    const user = await context.session.getUser(context, instData);
    const board = await context.block.assertGetBlockById<IBoard>(
        context,
        data.boardId,
        throwBoardNotFoundError
    );

    canReadOrganization(board.parent, user);
    const update: Partial<IBoard> = processUpdateBoardInput(
        board,
        data.data,
        user
    );

    const updatedBoard = await context.block.updateBlockById<IBoard>(
        context,
        data.boardId,
        update
    );

    assertBoard(updatedBoard);

    // TODO: should we wait for these to complete, cause a user can reload while they're pending
    // and get incomplete/incorrect data
    fireAndForgetPromise(
        persistBoardStatusChanges(context, instData, board, update, user)
    );
    fireAndForgetPromise(
        persistBoardResolutionsChanges(context, instData, board, update)
    );
    fireAndForgetPromise(
        persistBoardLabelChanges(context, instData, board, update)
    );

    return { board: getPublicBoardData(updatedBoard) };
};

export default updateBoard;
