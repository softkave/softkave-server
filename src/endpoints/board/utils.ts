import { getDateStringIfExists } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { BoardDoesNotExistError } from "./errors";
import { IBoard, IPublicBoard } from "./types";

const publicBoardFields = getFields<IPublicBoard>({
    customId: true,
    createdBy: true,
    createdAt: getDateStringIfExists,
    type: true,
    name: true,
    description: true,
    color: true,
    updatedAt: getDateStringIfExists,
    updatedBy: true,
    parent: true,
    rootBlockId: true,
    boardStatuses: {
        createdAt: getDateStringIfExists,
        createdBy: true,
        customId: true,
        description: true,
        updatedAt: getDateStringIfExists,
        updatedBy: true,
        color: true,
        name: true,
        position: true,
    },
    boardLabels: {
        createdAt: getDateStringIfExists,
        createdBy: true,
        customId: true,
        description: true,
        updatedAt: getDateStringIfExists,
        updatedBy: true,
        color: true,
        name: true,
    },
    boardResolutions: {
        createdAt: getDateStringIfExists,
        createdBy: true,
        customId: true,
        description: true,
        updatedAt: getDateStringIfExists,
        updatedBy: true,
        name: true,
    },
    currentSprintId: true,
    sprintOptions: {
        createdAt: getDateStringIfExists,
        createdBy: true,
        duration: true,
        updatedAt: getDateStringIfExists,
        updatedBy: true,
    },
    lastSprintId: true,
});

export function getPublicBoardData(board: Partial<IBoard>): IPublicBoard {
    return extractFields(board, publicBoardFields);
}

export function getPublicBoardsArray(
    boards: Array<Partial<IBoard>>
): IPublicBoard[] {
    // @ts-ignore
    return boards.map((board) => extractFields(board, publicBoardFields));
}

export function throwBoardNotFoundError() {
    throw new BoardDoesNotExistError();
}

export function assertBoard(board?: IBoard | null) {
    if (!board) {
        throwBoardNotFoundError();
    }
}
