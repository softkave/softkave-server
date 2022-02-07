import { BlockType } from "../../../mongo/block";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import { OrganizationDoesNotExistError } from "../../organization/errors";
import { BoardExistsError } from "../errors";
import { IBoard } from "../types";
import { getPublicBoardData } from "../utils";
import { CreateBoardEndpoint } from "./types";
import { addBoardJoiSchema } from "./validation";

const createBoard: CreateBoardEndpoint = async (context, instData) => {
    const data = validate(instData.data, addBoardJoiSchema);
    const user = await context.session.getUser(context, instData);
    await context.block.assertBlockById(context, data.board.parent, () => {
        throw new OrganizationDoesNotExistError();
    });

    canReadOrganization(data.board.parent, user);
    const boardExists = await context.block.blockExists(
        context,
        data.board.name.toLowerCase(),
        BlockType.Board,
        data.board.parent
    );

    if (boardExists) {
        throw new BoardExistsError();
    }

    const board: Omit<IBoard, "customId"> = {
        createdBy: user.customId,
        createdAt: getDate(),
        type: BlockType.Board,
        name: data.board.name,
        description: data.board.description,
        parent: data.board.parent,
        rootBlockId: data.board.parent,
        color: data.board.color,
        boardStatuses: data.board.boardStatuses.map((item) => ({
            ...item,
            createdAt: getDate(),
            createdBy: user.customId,
        })),
        boardLabels: data.board.boardLabels.map((item) => ({
            ...item,
            createdAt: getDate(),
            createdBy: user.customId,
        })),
        boardResolutions: data.board.boardResolutions.map((item) => ({
            ...item,
            createdAt: getDate(),
            createdBy: user.customId,
        })),
    };

    const savedBoard = await context.block.saveBlock<IBoard>(context, board);
    return {
        board: getPublicBoardData(savedBoard),
    };
};

export default createBoard;
