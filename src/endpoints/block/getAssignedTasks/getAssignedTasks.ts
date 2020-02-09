import { IGetAssignedTasksContext, IGetAssignedTasksResult } from "./types";

async function getUserData(
  context: IGetAssignedTasksContext
): Promise<IGetAssignedTasksResult> {
  const blocks = await context.getAssignedTasksFromStorage();

  return {
    blocks
  };
}

export default getUserData;
