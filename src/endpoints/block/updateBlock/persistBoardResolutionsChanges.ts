import {
    AuditLogActionType,
    AuditLogResourceType,
} from "../../../mongo/audit-log";
import { IBlock, IBoardStatusResolution } from "../../../mongo/block";
import { indexArray } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { IAuditLogInsertEntry } from "../../contexts/AuditLogContext";
import RequestData from "../../RequestData";
import { fireAndForgetPromise } from "../../utils";
import { getBlockRootBlockId } from "../utils";
import { IUpdateBlockContext, IUpdateBlockParameters } from "./types";

function getResolutionChanges(
    old: IBoardStatusResolution,
    nw: IBoardStatusResolution
): Array<keyof IBoardStatusResolution> {
    return ["description", "name"].reduce((accumulator, field) => {
        if (old[field] !== nw[field]) {
            accumulator.push(field);
        }

        return accumulator;
    }, []);
}

async function persistBoardResolutionsChanges(
    context: IUpdateBlockContext,
    instData: RequestData<IUpdateBlockParameters>,
    block: IBlock,
    data: Partial<IBlock>
) {
    const boardResolutions = data.boardResolutions;

    if (!boardResolutions) {
        return;
    }

    const oldBoardResolutions = block.boardResolutions;
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
                action: AuditLogActionType.Delete,
                resourceId: resolution.customId,
                resourceType: AuditLogResourceType.Resolution,
                organizationId: getBlockRootBlockId(block),
                resourceOwnerId: block.customId,
            });

            deletedResolutionIds.push(resolution.customId);
        }
    });

    boardResolutions.forEach((resolution) => {
        const existingResolution =
            indexedOldBoardResolutions[resolution.customId];

        if (!existingResolution) {
            logEntries.push({
                action: AuditLogActionType.Create,
                resourceId: resolution.customId,
                resourceType: AuditLogResourceType.Resolution,
                organizationId: getBlockRootBlockId(block),
                resourceOwnerId: block.customId,
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
                action: AuditLogActionType.Update,
                resourceId: resolution.customId,
                resourceType: AuditLogResourceType.Resolution,
                organizationId: getBlockRootBlockId(block),
                resourceOwnerId: block.customId,
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
    fireAndForgetPromise(
        context.bulkUpdateDeletedResolutionsInTasks(
            context,
            block.customId,
            deletedResolutionIds
        )
    );

    context.auditLog.insertMany(context, instData, logEntries);
}

export default persistBoardResolutionsChanges;
