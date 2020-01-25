import { IGetAssignedTasksContext, IGetAssignedTasksResult } from "./types";

async function getUserData(
  context: IGetAssignedTasksContext
): Promise<IGetAssignedTasksResult> {
  const blocks = await context.getAssignedTasksFromDatabase();

  return {
    blocks
  };
}

export default getUserData;
