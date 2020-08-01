import { IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { indexArray } from "../../../utilities/fns";
import RequestData from "../../contexts/RequestData";
import { fireAndForgetPromise } from "../../utils";
import diffAssignedUsers from "./diffAssignedUsers";
import { IUpdateBlockContext, IUpdateBlockParameters } from "./types";

// TODO: should we send notifications too?

async function sendNewlyAssignedTaskEmail(
  context: IUpdateBlockContext,
  instData: RequestData<IUpdateBlockParameters>,
  block: IBlock
) {
  const data = instData.data;
  const user = await context.session.getUser(context, instData);

  // TODO: should we send an email if you're the one who assigned it to yourself?
  // TODO: how should we respect the user and not spam them? -- user settings

  const assignedUsersDiffResult = diffAssignedUsers(block, data.data);
  const newlyAssignedUsers = assignedUsersDiffResult.newAssignees;

  if (newlyAssignedUsers.length === 0) {
    return;
  }

  const newAssignees = await context.user.bulkGetUsersById(
    context,
    newlyAssignedUsers.map((assignedUser) => assignedUser.userId)
  );

  const org = await context.block.getBlockById(context, block.rootBlockId);
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
        data.data.name || block.name,
        data.data.description || block.description,
        user,
        assignee
      )
    );
  });
}

export default sendNewlyAssignedTaskEmail;
