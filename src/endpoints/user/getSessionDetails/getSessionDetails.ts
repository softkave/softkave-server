import { IGetSessionDetailsContext } from "./types";

async function getSessionDetails(
  context: IGetSessionDetailsContext
): Promise<any> {
  const user = await context.getUser();
  const notificationCount = await context.getNotificationsCount(user.email);
  const assignedTaskCount = await context.getAssignedTasksCount(user.customId);
  const organisationsCount = context.getOrgsCount(user.orgs.length);

  return {
    notificationCount,
    assignedTaskCount,
    organisationsCount
  };
}

export default getSessionDetails;
