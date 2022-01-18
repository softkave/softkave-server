import {
    IBlockLabel,
    IBlockStatus,
    IBoardStatusResolution,
} from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { getDate, indexArray } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import { fireAndForgetPromise, getComplexTypeArrayInput } from "../../utils";
import { IBoard } from "../types";
import {
    assertBoard,
    getPublicBoardData,
    throwBoardNotFoundError,
} from "../utils";
import persistBoardLabelChanges from "./persistBoardLabelChanges";
import persistBoardResolutionsChanges from "./persistBoardResolutionsChanges";
import persistBoardStatusChanges from "./persistBoardStatusChanges";
import { IUpdateBoardInput, UpdateBoardEndpoint } from "./types";
import { updateBoardJoiSchema } from "./validation";

function mergeStatusUpdates(
    board: IBoard,
    data: IUpdateBoardInput,
    user: IUser
): IBlockStatus[] | undefined {
    if (!data.boardStatuses) {
        return;
    }

    const statuses = board.boardStatuses;
    const { add, update, updateMap, removeMap } = getComplexTypeArrayInput(
        data.boardStatuses,
        "customId"
    );

    const updatedStatuses = statuses
        .filter((status) => !removeMap[status.customId])
        .map((status) => {
            const incomingUpdate = updateMap[status.customId];

            if (!incomingUpdate) {
                return status;
            }

            const updatedStatus = {
                ...status,
                ...incomingUpdate,
                updatedAt: getDate(),
                updatedBy: user.customId,
            };

            return updatedStatus;
        });

    add.forEach((statusInput) => {
        const status = {
            ...statusInput,
            createdAt: getDate(),
            createdBy: user.customId,
        };

        updatedStatuses.splice(statusInput.position, 0, status);
    });

    const statusPosMap = indexArray(updatedStatuses, {
        path: "customId",
        reducer: (u1, u2, i) => i,
    });

    update.forEach((statusInput) => {
        const currentPos = statusPosMap[statusInput.customId];

        if (currentPos !== statusInput.position) {
            const status = updatedStatuses.splice(currentPos, 1);
            updatedStatuses.splice(statusInput.position, 0, status[0]);
        }
    });

    return updatedStatuses;
}

function mergeLabelUpdates(
    board: IBoard,
    data: IUpdateBoardInput,
    user: IUser
): IBlockLabel[] | undefined {
    if (!data.boardLabels) {
        return;
    }

    const labels = board.boardLabels || [];
    const { add, updateMap, removeMap } = getComplexTypeArrayInput(
        data.boardLabels,
        "customId"
    );

    const updatedLabels = labels
        .filter((label) => !removeMap[label.customId])
        .map((label) => {
            const incomingUpdate = updateMap[label.customId];

            if (!incomingUpdate) {
                return label;
            }

            const updatedLabel = {
                ...label,
                ...incomingUpdate,
                updatedAt: getDate(),
                updatedBy: user.customId,
            };

            return updatedLabel;
        });

    add.forEach((labelInput) => {
        const label = {
            ...labelInput,
            createdAt: getDate(),
            createdBy: user.customId,
        };

        updatedLabels.push(label);
    });

    return updatedLabels;
}

function mergeResolutionUpdates(
    block: IBoard,
    data: IUpdateBoardInput,
    user: IUser
): IBoardStatusResolution[] | undefined {
    if (!data.boardResolutions) {
        return;
    }

    const resolutions = block.boardResolutions || [];
    const { add, updateMap, removeMap } = getComplexTypeArrayInput(
        data.boardResolutions,
        "customId"
    );

    const updatedResolutions = resolutions
        .filter((resolution) => !removeMap[resolution.customId])
        .map((resolution) => {
            const incomingUpdate = updateMap[resolution.customId];

            if (!incomingUpdate) {
                return resolution;
            }

            const updatedResolution = {
                ...resolution,
                ...incomingUpdate,
                updatedAt: getDate(),
                updatedBy: user.customId,
            };

            return updatedResolution;
        });

    add.forEach((resolutionInput) => {
        const resolution = {
            ...resolutionInput,
            createdAt: getDate(),
            createdBy: user.customId,
        };

        updatedResolutions.push(resolution);
    });

    return updatedResolutions;
}

const updateBoard: UpdateBoardEndpoint = async (context, instData) => {
    const data = validate(instData.data, updateBoardJoiSchema);
    const user = await context.session.getUser(context, instData);
    const board = await context.block.assertGetBlockById<IBoard>(
        context,
        data.boardId,
        throwBoardNotFoundError
    );

    canReadOrganization(board.parent, user);

    const update: Partial<IBoard> = {
        name: data.data.name,
        description: data.data.description,
        color: data.data.color,
        boardStatuses: mergeStatusUpdates(board, data.data, user),
        boardLabels: mergeLabelUpdates(board, data.data, user),
        boardResolutions: mergeResolutionUpdates(board, data.data, user),
    };

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
