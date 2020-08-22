import { AuditLogActionType } from "../../../mongo/audit-log";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { IBlock } from "../../../mongo/block";
import { INotification, NotificationType } from "../../../mongo/notification";
import { IUser } from "../../../mongo/user";
import { getDate } from "../../../utilities/fns";
import getId from "../../../utilities/getId";
import { validate } from "../../../utilities/joiUtils";
import logger from "../../../utilities/logger";
import { IBulkUpdateById } from "../../../utilities/types";
import { IBaseContext } from "../../contexts/BaseContext";
import RequestData from "../../contexts/RequestData";
import { fireAndForgetPromise } from "../../utils";
import broadcastBlockUpdate from "../broadcastBlockUpdate";
import canReadBlock from "../canReadBlock";
import { getBlockRootBlockId } from "../utils";
import { DeleteBlockEndpoint, IDeleteBlockParameters } from "./types";
import { deleteBlockJoiSchema } from "./validation";

function removeOrgInUser(user: IUser, orgId: string) {
  const userOrgIndex = user.orgs.findIndex((org) => org.customId === orgId);
  user.orgs.splice(userOrgIndex, 1);
  return user;
}

async function deleteOrgCleanup(
  context: IBaseContext,
  instData: RequestData<IDeleteBlockParameters>,
  block: IBlock
) {
  const user = await context.session.getUser(context, instData);
  const userOrgIndex = user.orgs.findIndex(
    (org) => org.customId === block.customId
  );

  const userOrgs = [...user.orgs];
  userOrgs.splice(userOrgIndex, 1);

  // TODO: scrub user collection for unreferenced orgIds
  await context.session.updateUser(context, instData, {
    orgs: userOrgs,
  });

  const orgUsers = await context.user.getOrgUsers(context, block.customId);
  const notifications: INotification[] = [];
  const updates: Array<IBulkUpdateById<IUser>> = [];

  orgUsers.forEach((orgUser) => {
    if (orgUser.customId !== user.customId) {
      removeOrgInUser(orgUser, block.customId);
      updates.push({ id: orgUser.customId, data: { orgs: orgUser.orgs } });
    }

    const message =
      `Hi ${orgUser.name}, ` +
      `this is to notify you that ${block.name} has been deleted by ${user.name}. Have a good day!`;

    notifications.push({
      customId: getId(),

      // TODO: should we have a from field here?

      createdAt: getDate(),
      body: message,
      to: {
        email: orgUser.email,
      },
      type: NotificationType.OrgDeleted,
    });
  });

  context.user
    .bulkUpdateUsersById(context, updates)
    .catch((error) => console.error(error));
  context.notification
    .bulkSaveNotifications(context, notifications)
    .catch((error) => console.error(error));
}

const deleteBlock: DeleteBlockEndpoint = async (context, instData) => {
  const data = validate(instData.data, deleteBlockJoiSchema);
  const user = await context.session.getUser(context, instData);
  const block = await context.block.getBlockById(context, data.blockId);

  // TODO: it's possible that block is already deleted
  await canReadBlock({ user, block });
  await context.block.markBlockDeleted(context, block.customId, user);

  fireAndForgetPromise(
    broadcastBlockUpdate(
      context,
      instData,
      block.customId,
      { isDelete: true },
      undefined,
      block
    )
  );

  context.auditLog.insert(context, instData, {
    action: AuditLogActionType.Delete,
    resourceId: block.customId,
    resourceType: getBlockAuditLogResourceType(block),
    organizationId: getBlockRootBlockId(block),
  });

  if (block.type === "org") {
    deleteOrgCleanup(context, instData, block).catch((error) =>
      console.error(error)
    );
  }
};

export default deleteBlock;
