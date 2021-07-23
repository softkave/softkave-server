import { SystemActionType, SystemResourceType } from "../../../models/system";
import { IBlock, IBlockLabel } from "../../../mongo/block";
import { indexArray } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { IAuditLogInsertEntry } from "../../contexts/AuditLogContext";
import RequestData from "../../RequestData";
import { fireAndForgetPromise } from "../../utils";
import { getBlockRootBlockId } from "../utils";
import { IUpdateBlockContext, IUpdateBlockParameters } from "./types";

function getLabelChangedFields(
    s1: IBlockLabel,
    s2: IBlockLabel
): Array<keyof IBlockLabel> {
    return ["color", "description", "name"].reduce((accumulator, field) => {
        if (s1[field] !== s2[field]) {
            accumulator.push(field);
        }

        return accumulator;
    }, []);
}

async function persistBoardLabelChanges(
    context: IUpdateBlockContext,
    instData: RequestData<IUpdateBlockParameters>,
    block: IBlock,
    data: Partial<IBlock>
) {
    const boardLabels = data.boardLabels;

    if (!boardLabels) {
        return;
    }

    const oldBoardLabels = block.boardLabels || [];
    const indexedOldBoardLabels = indexArray(oldBoardLabels, {
        path: "customId",
    });

    const indexedNewBoardLabels = indexArray(boardLabels, {
        path: "customId",
    });

    const logEntries: IAuditLogInsertEntry[] = [];
    const deletedLabelIds: string[] = [];

    oldBoardLabels.forEach((label) => {
        if (!indexedNewBoardLabels[label.customId]) {
            logEntries.push({
                action: SystemActionType.Delete,
                resourceId: label.customId,
                resourceType: SystemResourceType.Label,
                organizationId: getBlockRootBlockId(block),
                resourceOwnerId: block.customId,
            });

            deletedLabelIds.push(label.customId);
        }
    });

    boardLabels.forEach((label) => {
        const existingLabel = indexedOldBoardLabels[label.customId];

        if (!existingLabel) {
            logEntries.push({
                action: SystemActionType.Create,
                resourceId: label.customId,
                resourceType: SystemResourceType.Label,
                organizationId: getBlockRootBlockId(block),
                resourceOwnerId: block.customId,
            });

            return;
        }

        if (existingLabel.updatedAt !== label.updatedAt) {
            const changedFields = getLabelChangedFields(existingLabel, label);
            const newValue: any = {};
            const oldValue: any = {};

            if (changedFields.length === 0) {
                return;
            }

            changedFields.forEach((field) => {
                oldValue[field] = existingLabel[field];
                newValue[field] = label[field];
            });

            logEntries.push({
                action: SystemActionType.Update,
                resourceId: label.customId,
                resourceType: SystemResourceType.Label,
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

    if (deletedLabelIds.length === 0) {
        // TODO: there will be empty label updates in the audit log table
        // write a script to delete them

        // TODO: do this for all bulk update items
        return;
    }

    // TODO: how should we handle if this fails?
    // if it fails, the task will contain labels that have been deleted, maybe change in client-side
    // TODO: maybe wite a cron job to clean things up
    fireAndForgetPromise(
        context.bulkRemoveDeletedLabelsInTasks(
            context,
            block.customId,
            deletedLabelIds
        )
    );

    context.auditLog.insertMany(context, instData, logEntries);
}

export default persistBoardLabelChanges;
