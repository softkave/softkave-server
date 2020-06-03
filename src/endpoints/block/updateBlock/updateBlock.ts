import diff from "diff";
import pick from "lodash/pick";
import {
  AuditLogActionType,
  AuditLogResourceType,
} from "../../../mongo/audit-log";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { IBlock, IBlockStatus } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { indexArray } from "../../../utilities/fns";
import getId from "../../../utilities/getId";
import { validate } from "../../../utilities/joiUtils";
import { IAuditLogInsertInput } from "../../contexts/AuditLogContext";
import { IEndpointInstanceData } from "../../contexts/types";
import { fireAndForgetPromise } from "../../utils";
import canReadBlock from "../canReadBlock";
import {
  ITaskAssigneesDiff,
  IUpdateBlockContext,
  IUpdateBlockInput,
  IUpdateBlockParameters,
  UpdateBlockEndpoint,
} from "./types";
import { updateBlockJoiSchema } from "./validation";

const diffAssignedUsers = (
  block: IBlock,
  data: IUpdateBlockInput
): ITaskAssigneesDiff => {
  const existingTaskCollaborators = block.assignees || [];
  const incomingTaskCollaborators = data.assignees || [];
  const existingAssignedUsers = indexArray(existingTaskCollaborators, {
    path: "userId",
  });
  const incomingAssigendUsers = indexArray(incomingTaskCollaborators, {
    path: "userId",
  });

  const newAssignedUsers = incomingTaskCollaborators.filter((user) => {
    if (!existingAssignedUsers[user.userId]) {
      return true;
    } else {
      return false;
    }
  });

  const removedAssignedUsers = existingTaskCollaborators.filter((user) => {
    if (!incomingAssigendUsers[user.userId]) {
      return true;
    } else {
      return false;
    }
  });

  return {
    newAssignees: newAssignedUsers,
    removedAssignees: removedAssignedUsers,
  };
};

// TODO: should we send notifications too?

async function sendNewlyAssignedTaskEmail(
  context: IUpdateBlockContext,
  instData: IEndpointInstanceData<IUpdateBlockParameters>,
  block: IBlock
) {
  const data = instData.data;
  const user = await context.session.getUser(context.models, instData);

  // TODO: should we send an email if you're the one who assigned it to yourself?
  // TODO: how should we respect the user and not spam them? -- user settings

  const assignedUsersDiffResult = diffAssignedUsers(block, data.data);
  const newlyAssignedUsers = assignedUsersDiffResult.newAssignees;

  if (newlyAssignedUsers.length === 0) {
    return;
  }

  const newAssignees = await context.user.bulkGetUsersById(
    context.models,
    newlyAssignedUsers.map((assignedUser) => assignedUser.userId)
  );

  const org = await context.block.getBlockById(
    context.models,
    block.rootBlockId
  );

  const assigneesMap = indexArray(newAssignees, { path: "customId" });

  // TODO: what should we do if any of the above calls fail?

  assignedUsersDiffResult.newAssignees.forEach((assignedUser) => {
    const assignee: IUser = assigneesMap[assignedUser.userId];

    // TODO: what else should we do if the user does not exist?

    if (assignee && assignee.customId === user.customId) {
      return;
    }

    fireAndForgetPromise(
      context.sendAssignedTaskEmailNotification(
        org,
        data.data.description || block.description,
        user,
        assignee
      )
    );
  });
}

function getStatusChangedFields(
  old: IBlockStatus,
  nw: IBlockStatus
): Array<keyof IBlockStatus> {
  return Object.keys(old).reduce((accumulator, field) => {
    if (old[field] !== nw[field]) {
      accumulator.push(field);
    }

    return accumulator;
  }, []);
}

async function processBoardStatusChanges(
  context: IUpdateBlockContext,
  instData: IEndpointInstanceData<IUpdateBlockParameters>,
  block: IBlock
) {
  const data = instData.data;
  const boardStatuses = data.data.boardStatuses;

  if (!boardStatuses || boardStatuses.length === 0) {
    return;
  }

  const oldBoardStatuses = block.boardStatuses;
  const indexedOldBoardStatuses = indexArray(oldBoardStatuses, {
    path: "customId",
  });

  const indexedNewBoardStatuses = indexArray(boardStatuses, {
    path: "customId",
  });

  const logEntries: IAuditLogInsertInput[] = [];
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
        organizationId: block.rootBlockId,
        resourceOwnerId: block.customId,
      });

      const newIdIndex = index === 0 ? index + 1 : index - 1;
      const newId = boardStatuses[newIdIndex]?.customId;
      deletedStatusIdsWithReplacement.push({ newId, oldId: status.customId });
    }
  });

  boardStatuses.forEach((status) => {
    const existingStatus = indexedOldBoardStatuses[status.customId];

    if (!existingStatus) {
      logEntries.push({
        action: AuditLogActionType.Create,
        resourceId: status.customId,
        resourceType: AuditLogResourceType.Status,
        organizationId: block.rootBlockId,
        resourceOwnerId: block.customId,
      });

      return;
    }

    if (existingStatus.updatedAt !== status.updatedAt) {
      const diffResult = diff.diffJson(existingStatus, status);
      const newValue: any = {};
      const oldValue: any = {};

      diffResult.forEach((change) => {
        oldValue[change.value] = existingStatus[change.value];
        newValue[change.value] = status[change.value];
      });

      logEntries.push({
        action: AuditLogActionType.Update,
        resourceId: status.customId,
        resourceType: AuditLogResourceType.Status,
        organizationId: block.rootBlockId,
        resourceOwnerId: block.customId,
        change: {
          oldValue,
          newValue,
          customId: getId(),
        },
      });
    }
  });

  // TODO: how should we handle if this fails?
  // if it fails, the status will be incorrect, maybe change in client-side
  // TODO: maybe wite a cron job to clean things up
  fireAndForgetPromise(
    context.bulkUpdateDeletedStatusInTasks(
      context.models,
      block.customId,
      deletedStatusIdsWithReplacement
    )
  );

  context.auditLog.insertMany(context.models, instData, logEntries);
}

async function processBoardLabelChanges(
  context: IUpdateBlockContext,
  instData: IEndpointInstanceData<IUpdateBlockParameters>,
  block: IBlock
) {
  const data = instData.data;
  const boardLabels = data.data.boardLabels;

  if (!boardLabels || boardLabels.length === 0) {
    return;
  }

  const oldBoardLabels = block.boardLabels;
  const indexedOldBoardLabels = indexArray(oldBoardLabels, {
    path: "customId",
  });

  const indexedNewBoardLabels = indexArray(boardLabels, {
    path: "customId",
  });

  const logEntries: IAuditLogInsertInput[] = [];
  const deletedLabelIds: string[] = [];

  oldBoardLabels.forEach((label) => {
    if (!indexedNewBoardLabels[label.customId]) {
      logEntries.push({
        action: AuditLogActionType.Delete,
        resourceId: label.customId,
        resourceType: AuditLogResourceType.Label,
        organizationId: block.rootBlockId,
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
        organizationId: block.rootBlockId,
        resourceOwnerId: block.customId,
      });

      return;
    }

    if (existingLabel.updatedAt !== label.updatedAt) {
      const diffResult = diff.diffJson(existingLabel, label);
      const newValue: any = {};
      const oldValue: any = {};

      diffResult.forEach((change) => {
        oldValue[change.value] = existingLabel[change.value];
        newValue[change.value] = label[change.value];
      });

      logEntries.push({
        action: AuditLogActionType.Update,
        resourceId: label.customId,
        resourceType: AuditLogResourceType.Label,
        organizationId: block.rootBlockId,
        resourceOwnerId: block.customId,
        change: {
          oldValue,
          newValue,
          customId: getId(),
        },
      });
    }
  });

  // TODO: how should we handle if this fails?
  // if it fails, the task will contain labels that have been deleted, maybe change in client-side
  // TODO: maybe wite a cron job to clean things up
  fireAndForgetPromise(
    context.bulkRemoveDeletedLabelsInTasks(
      context.models,
      block.rootBlockId,
      deletedLabelIds
    )
  );

  context.auditLog.insertMany(context.models, instData, logEntries);
}

const updateBlock: UpdateBlockEndpoint = async (context, instData) => {
  const data = validate(instData.data, updateBlockJoiSchema);
  const updateData = data.data;
  const user = await context.session.getUser(context.models, instData);
  const block = await context.block.getBlockById(context.models, data.customId);

  canReadBlock({ user, block });

  const parent = updateData.parent;
  delete updateData.parent;

  await context.block.updateBlockById(
    context.models,
    data.customId,
    updateData
  );

  fireAndForgetPromise(processBoardStatusChanges(context, instData, block));
  fireAndForgetPromise(processBoardLabelChanges(context, instData, block));
  fireAndForgetPromise(sendNewlyAssignedTaskEmail(context, instData, block));

  context.auditLog.insert(context.models, instData, {
    action: AuditLogActionType.Update,
    resourceId: block.customId,
    resourceType: getBlockAuditLogResourceType(block),
    change: {
      oldValue: pick(block, Object.keys(data.data)),
      newValue: data.data,
      customId: getId(),
    },
  });

  if (parent && block.parent !== parent) {
    await context.transferBlock(context, {
      ...instData,
      data: { destinationBlockId: parent, draggedBlockId: block.customId },
    });
  }
};

export default updateBlock;
