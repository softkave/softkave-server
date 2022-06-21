import {
    IBlockLabel,
    IBlockStatus,
    IBoardStatusResolution,
} from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { getDate, indexArray } from "../../../utilities/fns";
import { IUpdateComplexTypeArrayInput } from "../../types";
import { getComplexTypeArrayInput } from "../../utils";
import {
    IBlockLabelInput,
    IBlockStatusInput,
    IBoard,
    IBoardStatusResolutionInput,
} from "../types";
import { IUpdateBoardInput } from "./types";

export function mergeStatusUpdates(
    board: IBoard,
    data: IUpdateComplexTypeArrayInput<IBlockStatusInput>,
    user: IUser
): IBlockStatus[] | undefined {
    const statuses = board.boardStatuses;
    const { add, update, updateMap, removeMap } = getComplexTypeArrayInput(
        data,
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

export function mergeLabelUpdates(
    board: IBoard,
    data: IUpdateComplexTypeArrayInput<IBlockLabelInput>,
    user: IUser
): IBlockLabel[] | undefined {
    const labels = board.boardLabels || [];
    const { add, updateMap, removeMap } = getComplexTypeArrayInput(
        data,
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

export function mergeResolutionUpdates(
    block: IBoard,
    data: IUpdateComplexTypeArrayInput<IBoardStatusResolutionInput>,
    user: IUser
): IBoardStatusResolution[] | undefined {
    const resolutions = block.boardResolutions || [];
    const { add, updateMap, removeMap } = getComplexTypeArrayInput(
        data,
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
