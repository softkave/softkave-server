import { IGetAssignedTasksContext, IGetAssignedTasksResult } from "./types";

async function getAssignedTasks(
  context: IGetAssignedTasksContext
): Promise<IGetAssignedTasksResult> {
  const blocks = await context.getAssignedTasksFromStorage();

  return {
    blocks
  };
}

export default getAssignedTasks;
