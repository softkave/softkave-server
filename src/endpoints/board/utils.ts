import { BlockType, IBlock } from "../../mongo/block";
import {
    CollaborationRequestStatusType,
    ICollaborationRequest,
} from "../../mongo/collaboration-request";
import { getDateString } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { IBoard, IPublicBoard } from "./types";

const publicBoardFields = getFields<IPublicBoard>({
    customId: true,
    createdBy: true,
    createdAt: getDateString,
    type: true,
    name: true,
    description: true,
    color: true,
    updatedAt: getDateString,
    updatedBy: true,
    parent: true,
    rootBlockId: true,
    boardStatuses: {
        createdAt: getDateString,
        createdBy: true,
        customId: true,
        description: true,
        updatedAt: getDateString,
        updatedBy: true,
        color: true,
        name: true,
        position: true,
    },
    boardLabels: {
        createdAt: getDateString,
        createdBy: true,
        customId: true,
        description: true,
        updatedAt: getDateString,
        updatedBy: true,
        color: true,
        name: true,
    },
    boardResolutions: {
        createdAt: getDateString,
        createdBy: true,
        customId: true,
        description: true,
        updatedAt: getDateString,
        updatedBy: true,
        name: true,
    },
    currentSprintId: true,
    sprintOptions: {
        createdAt: getDateString,
        createdBy: true,
        duration: true,
        updatedAt: getDateString,
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
