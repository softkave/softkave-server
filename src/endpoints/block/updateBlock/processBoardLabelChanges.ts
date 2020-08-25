import {
  AuditLogActionType,
  AuditLogResourceType,
} from "../../../mongo/audit-log";
import { IBlock } from "../../../mongo/block";
import { indexArray } from "../../../utilities/fns";
import getId from "../../../utilities/getId";
import { IAuditLogInsertEntry } from "../../contexts/AuditLogContext";
import RequestData from "../../contexts/RequestData";
import { fireAndForgetPromise } from "../../utils";
import { getBlockRootBlockId } from "../utils";
import getStatusChangedFields from "./getStatusChangedFields";
import { IUpdateBlockContext, IUpdateBlockParameters } from "./types";

async function processBoardLabelChanges(
  context: IUpdateBlockContext,
  instData: RequestData<IUpdateBlockParameters>,
  block: IBlock
) {
  const data = instData.data;
  const boardLabels = data.data.boardLabels;

  if (!boardLabels) {
    return;
  }

  const oldBoardLabels = block.boardLabels;
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
        action: AuditLogActionType.Delete,
        resourceId: label.customId,
        resourceType: AuditLogResourceType.Label,
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
        action: AuditLogActionType.Create,
        resourceId: label.customId,
        resourceType: AuditLogResourceType.Label,
        organizationId: getBlockRootBlockId(block),
        resourceOwnerId: block.customId,
      });

      return;
    }

    if (existingLabel.updatedAt !== label.updatedAt) {
      const changedFields = getStatusChangedFields(existingLabel, label);
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
        action: AuditLogActionType.Update,
        resourceId: label.customId,
        resourceType: AuditLogResourceType.Label,
        organizationId: getBlockRootBlockId(block),
        resourceOwnerId: block.customId,
        change: {
          oldValue,
          newValue,
          customId: getId(),
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

export default processBoardLabelChanges;