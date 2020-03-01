import { IGetSessionDetailsContext, IGetSessionDetailsResult } from "./types";

async function getSessionDetails(
  context: IGetSessionDetailsContext
): Promise<IGetSessionDetailsResult> {
  const user = await context.getUser();
  const notificationsCount = await context.getNotificationsCount(user.email);
  const assignedTasksCount = await context.getAssignedTasksCount(user.customId);
  const organizationsCount = await context.getOrgsCount(user.orgs.length);

  return {
    notificationsCount,
    assignedTasksCount,
    organizationsCount
  };
}

export default getSessionDetails;
