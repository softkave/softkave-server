import { IGetSessionDetailsContext } from "./types";

async function getSessionDetails(context: IGetSessionDetailsContext) {
  const notificationCount = await context.getNotificationCount(
    context.data.user.email
  );
  const assignedTaskCount = await context.getAssignedTaskCount(
    context.data.user.customId
  );
  const organisationsCount = context.getOrgsCount(
    context.data.user.orgs.length
  );

  return {
    notificationCount,
    assignedTaskCount,
    organisationsCount
  };
}

export default getSessionDetails;
