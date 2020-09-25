import {
    AuditLogActionType,
    AuditLogResourceType,
} from "../../../mongo/audit-log";
import { IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { indexArray } from "../../../utilities/fns";
import getNewId from "../../../utilities/getId";
import { IAuditLogInsertEntry } from "../../contexts/AuditLogContext";
import RequestData from "../../contexts/RequestData";
import { fireAndForgetPromise } from "../../utils";
import { getBlockRootBlockId } from "../utils";
import getStatusChangedFields from "./getStatusChangedFields";
import { IUpdateBlockContext, IUpdateBlockParameters } from "./types";

async function processBoardStatusChanges(
    context: IUpdateBlockContext,
    instData: RequestData<IUpdateBlockParameters>,
    block: IBlock,
    user: IUser
) {
    const data = instData.data;
    const boardStatuses = data.data.boardStatuses;

    if (!boardStatuses) {
        return;
    }

    const oldBoardStatuses = block.boardStatuses;
    const indexedOldBoardStatuses = indexArray(oldBoardStatuses, {
        path: "customId",
    });

    const indexedNewBoardStatuses = indexArray(boardStatuses, {
        path: "customId",
    });

    const logEntries: IAuditLogInsertEntry[] = [];
    const deletedStatusIdsWithReplacement: Array<{
        oldId: string;
        newId: string;
    }> = [];

    oldBoardStatuses.forEach((status, index) => {
        if (!indexedNewBoardStatuses[status.customId]) {
            logEntries.push({
                action: AuditLogActionType.Delete,
                resourceId: status.customId,
                resourceType: AuditLogResourceType.Status,
                organizationId: getBlockRootBlockId(block),
                resourceOwnerId: block.customId,
            });

            const newIdIndex =
                index >= boardStatuses.length ? index - 1 : index;
            const newId = boardStatuses[newIdIndex]?.customId;
            deletedStatusIdsWithReplacement.push({
                newId,
                oldId: status.customId,
            });
        }
    });

    boardStatuses.forEach((status) => {
        const existingStatus = indexedOldBoardStatuses[status.customId];

        if (!existingStatus) {
            logEntries.push({
                action: AuditLogActionType.Create,
                resourceId: status.customId,
                resourceType: AuditLogResourceType.Status,
                organizationId: getBlockRootBlockId(block),
                resourceOwnerId: block.customId,
            });

            return;
        }

        if (existingStatus.updatedAt !== status.updatedAt) {
            const changedFields = getStatusChangedFields(
                existingStatus,
                status
            );
            const newValue: any = {};
            const oldValue: any = {};

            if (changedFields.length === 0) {
                return;
            }

            changedFields.forEach((field) => {
                oldValue[field] = existingStatus[field];
                newValue[field] = status[field];
            });

            logEntries.push({
                action: AuditLogActionType.Update,
                resourceId: status.customId,
                resourceType: AuditLogResourceType.Status,
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

    if (deletedStatusIdsWithReplacement.length === 0) {
        // TODO: there will be empty status updates in the audit log table
        // write a script to delete them
        return;
    }

    // TODO: how should we handle if this fails?
    // if it fails, the status will be incorrect, maybe change in client-side
    // TODO: maybe wite a cron job to clean things up
    fireAndForgetPromise(
        context.bulkUpdateDeletedStatusInTasks(
            context,
            block.customId,
            deletedStatusIdsWithReplacement,
            user
        )
    );

    context.auditLog.insertMany(context, instData, logEntries);
}

export default processBoardStatusChanges;
