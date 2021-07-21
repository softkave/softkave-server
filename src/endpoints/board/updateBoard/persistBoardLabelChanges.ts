import { SystemActionType, SystemResourceType } from "../../../models/system";
import { IBlockLabel } from "../../../mongo/block";
import { indexArray } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { IAuditLogInsertEntry } from "../../contexts/AuditLogContext";
import RequestData from "../../RequestData";
import { fireAndForganizationetPromise } from "../../utils";
import { IBoard } from "../types";
import { IUpdateBoardContext, IUpdateBoardParameters } from "./types";

function getLabelChangedFields(
    label1: IBlockLabel,
    label2: IBlockLabel
): Array<keyof IBlockLabel> {
    return ["color", "description", "name"].reduce((accumulator, field) => {
        if (label1[field] !== label2[field]) {
            accumulator.push(field);
        }

        return accumulator;
    }, []);
}

async function persistBoardLabelChanges(
    context: IUpdateBoardContext,
    instData: RequestData<IUpdateBoardParameters>,
    board: IBoard,
    data: Partial<IBoard>
) {
    const boardLabels = data.boardLabels;

    if (!boardLabels) {
        return;
    }

    const oldBoardLabels = board.boardLabels || [];
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
                organizationId: board.parent,
                resourceOwnerId: board.customId,
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
                organizationId: board.parent,
                resourceOwnerId: board.customId,
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

    if (deletedLabelIds.length === 0) {
        // TODO: there will be empty label updates in the audit log table
        // write a script to delete them

        // TODO: do this for all bulk update items
        return;
    }

    // TODO: how should we handle if this fails?
    // if it fails, the task will contain labels that have been deleted, maybe change in client-side
    // TODO: maybe wite a cron job to clean things up
    fireAndForganizationetPromise(
        context.bulkRemoveDeletedLabelsInTasks(
            context,
            board.customId,
            deletedLabelIds
        )
    );

    context.auditLog.insertMany(context, instData, logEntries);
}

export default persistBoardLabelChanges;
