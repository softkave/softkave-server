import { ISubTask } from "../../../mongo/block";
import { ISprint } from "../../../mongo/sprint";
import { IUser } from "../../../mongo/user";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { IBoard } from "../../boards/types";
import {
  ExtractFieldsDefaultScalarTypes,
  IUpdateComplexTypeArrayInput,
} from "../../types";
import {
  extractFields,
  getComplexTypeArrayInput,
  getFields,
} from "../../utils";
import { ITask, ITaskSprintInput } from "../types";
import { IUpdateTaskInput } from "./types";

interface IProcessUpdateTaskExtractFieldsExtraArgs {
  user: IUser;
  task: ITask;
}

const fields = getFields<
  IUpdateTaskInput,
  | ExtractFieldsDefaultScalarTypes
  | IUpdateComplexTypeArrayInput<any>
  | ITaskSprintInput,
  IProcessUpdateTaskExtractFieldsExtraArgs,
  Partial<ITask>
>({
  name: true,
  description: true,
  priority: true,
  parent: true,
  subTasks: (data, args) => {
    const subTasks = args.task.subTasks || [];
    const { add, updateMap, removeMap } = getComplexTypeArrayInput(
      data,
      "customId"
    );

    return subTasks
      .filter((subTask) => !removeMap[subTask.customId])
      .map((subTask) => {
        const incomingUpdate = updateMap[subTask.customId];

        if (!incomingUpdate) {
          return subTask;
        }

        const updatedSubTask = {
          ...subTask,
          ...incomingUpdate,
          updatedAt: getDate(),
          updatedBy: args.user.customId,
        };

        if (incomingUpdate.completedBy) {
          updatedSubTask.completedAt = getDate();
          updatedSubTask.completedBy = args.user.customId;
        }

        return updatedSubTask;
      })
      .concat(
        add.map((subTask) => {
          const newSubTask: ISubTask = {
            description: subTask.description,
            createdAt: getDate(),
            createdBy: args.user.customId,
            customId: getNewId(),
          };

          if (subTask.completedBy) {
            newSubTask.completedAt = getDate();
            newSubTask.completedBy = args.user.customId;
          }

          return newSubTask;
        })
      );
  },
  dueAt: (data) => {
    return getDate(data);
  },
  assignees: (data, args) => {
    const assignees = args.task.assignees || [];
    const { add, removeMap } = getComplexTypeArrayInput(data, "userId");

    return assignees
      .filter((assignee) => !removeMap[assignee.userId])
      .concat(
        add.map((assignee) => {
          const newAssignee = {
            ...assignee,
            assignedAt: getDate(),
            assignedBy: args.user.customId,
          };

          return newAssignee;
        })
      );
  },
  status: true,
  taskResolution: true,
  labels: (data, args) => {
    const labels = args.task.labels || [];
    const { add, removeMap } = getComplexTypeArrayInput(data, "customId");

    return labels
      .filter((label) => !removeMap[label.customId])
      .concat(
        add.map((label) => {
          const newLabel = {
            ...label,
            assignedAt: getDate(),
            assignedBy: args.user.customId,
          };

          return newLabel;
        })
      );
  },
  taskSprint: (data, args) => {
    if (!data) {
      return null;
    }

    return {
      sprintId: data.sprintId,
      assignedAt: getDate(),
      assignedBy: args.user.customId,
    };
  },
});

export default function processUpdateTaskInput(
  task: ITask,
  data: IUpdateTaskInput,
  user: IUser,
  board: IBoard,
  existingSprint: ISprint | null,
  newSprint: ISprint | null
): Partial<ITask> {
  const update = extractFields(data, fields, {
    task: task,
    user,
  });

  if (update.status && update.status !== task.status) {
    update.statusAssignedAt = getDate();
    update.statusAssignedBy = user.customId;
    const assignees = update.assignees || task.assignees || [];

    if (assignees.length === 0) {
      assignees.push({
        userId: user.customId,
        assignedAt: getDate(),
        assignedBy: user.customId,
      });

      update.assignees = assignees;
    }
  }

  const statusList = board.boardStatuses || [];
  const taskCompleteStatus = statusList[statusList.length - 1];

  // Move task to backlog if status is updated from completed,
  // and it's sprint is completed
  if (
    existingSprint &&
    existingSprint.endDate &&
    update.status &&
    taskCompleteStatus &&
    update.status !== taskCompleteStatus.customId
  ) {
    if (newSprint && newSprint.endDate) {
      update.taskSprint = null;
    }
  }

  update.updatedBy = user.customId;
  update.updatedAt = getDate();
  return update;
}
