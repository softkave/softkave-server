import { AuditLogActionType } from "../../../mongo/audit-log";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { IBlock } from "../../../mongo/block";
import { INotification, NotificationType } from "../../../mongo/notification";
import { IUser } from "../../../mongo/user";
import { getDateString } from "../../../utilities/fns";
import getId from "../../../utilities/getId";
import { validate } from "../../../utilities/joiUtils";
import logger from "../../../utilities/logger";
import { IBaseContext } from "../../contexts/BaseContext";
import {
  IBulkUpdateByIdItem,
  IEndpointInstanceData,
} from "../../contexts/types";
import canReadBlock from "../canReadBlock";
import { DeleteBlockEndpoint, IDeleteBlockParameters } from "./types";
import { deleteBlockJoiSchema } from "./validation";

function removeOrgInUser(user: IUser, orgId: string) {
  const userOrgIndex = user.orgs.findIndex((org) => org.customId === orgId);
  user.orgs.splice(userOrgIndex, 1);
  return user;
}

async function deleteOrgCleanup(
  context: IBaseContext,
  instData: IEndpointInstanceData<IDeleteBlockParameters>,
  block: IBlock
) {
  const user = await context.session.getUser(context.models, instData);
  const userOrgIndex = user.orgs.findIndex(
    (org) => org.customId === block.customId
  );

  const userOrgs = [...user.orgs];
  userOrgs.splice(userOrgIndex, 1);

  // TODO: scrub user collection for unreferenced orgIds
  await context.session.updateUser(context.models, instData, {
    orgs: userOrgs,
  });

  const orgUsers = await context.user.getOrgUsers(
    context.models,
    block.customId
  );
  const notifications: INotification[] = [];
  const updates: Array<IBulkUpdateByIdItem<IUser>> = [];

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

      createdAt: getDateString(),
      body: message,
      to: {
        email: orgUser.email,
      },
      type: NotificationType.OrgDeleted,
    });
  });

  context.user
    .bulkUpdateUsersById(context.models, updates)
    .catch((error) => logger.error(error));
  context.notification
    .bulkSaveNotifications(context.models, notifications)
    .catch((error) => logger.error(error));
}

const deleteBlock: DeleteBlockEndpoint = async (context, instData) => {
  const data = validate(instData.data, deleteBlockJoiSchema);
  const user = await context.session.getUser(context.models, instData);
  const block = await context.block.getBlockById(context.models, data.customId);

  await canReadBlock({ user, block });
  await context.block.markBlockDeleted(context.models, block.customId, user);

  context.auditLog.insert(context.models, instData, {
    action: AuditLogActionType.Delete,
    resourceId: block.customId,
    resourceType: getBlockAuditLogResourceType(block),
    organizationId: block.rootBlockId,
  });

  if (block.type === "org") {
    deleteOrgCleanup(context, instData, block).catch((error) =>
      logger.error(error)
    );
  }
};

export default deleteBlock;
