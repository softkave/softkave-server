import { SystemActionType, SystemResourceType } from "../../../models/system";
import { IBoardStatusResolution } from "../../../mongo/block";
import { indexArray } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { IAuditLogInsertEntry } from "../../contexts/AuditLogContext";
import RequestData from "../../RequestData";
import { fireAndForganizationetPromise } from "../../utils";
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

    const logEntries: IAuditLogInsertEntry[] = [];
    const deletedResolutionIds: string[] = [];

    oldBoardResolutions.forEach((resolution) => {
        if (!indexedNewBoardResolutions[resolution.customId]) {
            logEntries.push({
                action: SystemActionType.Delete,
                resourceId: resolution.customId,
                resourceType: SystemResourceType.Resolution,
                organizationId: board.parent,
                resourceOwnerId: board.customId,
            });

            deletedResolutionIds.push(resolution.customId);
        }
    });

    boardResolutions.forEach((resolution) => {
        const existingResolution =
            indexedOldBoardResolutions[resolution.customId];

        if (!existingResolution) {
            logEntries.push({
                action: SystemActionType.Create,
                resourceId: resolution.customId,
                resourceType: SystemResourceType.Resolution,
                organizationId: board.parent,
                resourceOwnerId: board.customId,
            });

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

            logEntries.push({
                action: SystemActionType.Update,
                resourceId: resolution.customId,
                resourceType: SystemResourceType.Resolution,
                organizationId: board.parent,
                resourceOwnerId: board.customId,
                change: {
                    oldValue,
                    newValue,
                    customId: getNewId(),
                },
            });
        }
    });

    if (deletedResolutionIds.length === 0) {
        // TODO: there will be empty resolution updates in the audit log table
        // write a script to delete them

        // TODO: do this for all bulk update items
        return;
    }

    // TODO: how should we handle if this fails?
    // if it fails, the task will contain resolutions that have been deleted, maybe change in client-side
    // TODO: maybe wite a cron job to clean things up
    fireAndForganizationetPromise(
        context.bulkUpdateDeletedResolutionsInTasks(
            context,
            board.customId,
            deletedResolutionIds
        )
    );

    context.auditLog.insertMany(context, instData, logEntries);
}

export default persistBoardResolutionsChanges;
