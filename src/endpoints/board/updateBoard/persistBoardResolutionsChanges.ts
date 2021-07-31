import { IBoardStatusResolution } from "../../../mongo/block";
import { indexArray } from "../../../utilities/fns";
import RequestData from "../../RequestData";
import { fireAndForgetPromise } from "../../utils";
import { IBoard } from "../types";
import { IUpdateBoardContext, IUpdateBoardParameters } from "./types";

function getResolutionChanges(
    oldItem: IBoardStatusResolution,
    newItem: IBoardStatusResolution
): Array<keyof IBoardStatusResolution> {
    return ["description", "name"].reduce((accumulator, field) => {
        if (oldItem[field] !== newItem[field]) {
            accumulator.push(field);
        }

        return accumulator;
    }, []);
}

async function persistBoardResolutionsChanges(
    context: IUpdateBoardContext,
    instData: RequestData<IUpdateBoardParameters>,
    board: IBoard,
    data: Partial<IBoard>
) {
    const boardResolutions = data.boardResolutions;

    if (!boardResolutions) {
        return;
    }

    const oldBoardResolutions = board.boardResolutions || [];
    const indexedOldBoardResolutions = indexArray(oldBoardResolutions, {
        path: "customId",
    });

    const indexedNewBoardResolutions = indexArray(boardResolutions, {
        path: "customId",
    });

    const deletedResolutionIds: string[] = [];

    oldBoardResolutions.forEach((resolution) => {
        if (!indexedNewBoardResolutions[resolution.customId]) {
            deletedResolutionIds.push(resolution.customId);
        }
    });

    boardResolutions.forEach((resolution) => {
        const existingResolution =
            indexedOldBoardResolutions[resolution.customId];

        if (!existingResolution) {
            return;
        }

        if (existingResolution.updatedAt !== resolution.updatedAt) {
            const changedFields = getResolutionChanges(
                existingResolution,
                resolution
            );
            const newValue: any = {};
            const oldValue: any = {};

            if (changedFields.length === 0) {
                return;
            }

            changedFields.forEach((field) => {
                oldValue[field] = existingResolution[field];
                newValue[field] = resolution[field];
            });
        }
    });

    if (deletedResolutionIds.length === 0) {
        return;
    }

    // TODO: how should we handle if this fails?
    // if it fails, the task will contain resolutions that have been deleted, maybe change in client-side
    // TODO: maybe wite a cron job to clean things up
    fireAndForgetPromise(
        context.bulkUpdateDeletedResolutionsInTasks(
            context,
            board.customId,
            deletedResolutionIds
        )
    );
}

export default persistBoardResolutionsChanges;
