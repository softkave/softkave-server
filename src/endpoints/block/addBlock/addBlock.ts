import {
  AuditLogActionType,
  AuditLogResourceType,
} from "../../../mongo/audit-log";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { validate } from "../../../utilities/joiUtils";
import { fireAndForgetPromise } from "../../utils";
import broadcastBlockUpdate from "../broadcastBlockUpdate";
import canReadBlock from "../canReadBlock";
import { getBlockRootBlockId } from "../utils";
import blockValidationSchemas from "../validation";
import { AddBlockEndpoint } from "./types";

const addBlock: AddBlockEndpoint = async (context, instData) => {
  const data = validate(instData.data.block, blockValidationSchemas.newBlock);
  const newBlock = data;
  const user = await context.session.getUser(context, instData);

  if (newBlock.type === "org") {
    const orgSaveResult = await context.addBlock(context, {
      ...instData,
      data: { block: data },
    });

    const org = orgSaveResult.block;

    // TODO: scrub for orgs that are not added to user and add or clean them
    //    you can do this when user tries to read them, or add them again
    // TODO: scrub all data that failed it's pipeline

    const userOrgs = user.orgs.concat({ customId: org.customId });
    await context.session.updateUser(context, instData, {
      orgs: userOrgs,
    });

    context.auditLog.insert(context, instData, {
      action: AuditLogActionType.Create,
      resourceId: org.customId,
      resourceType: AuditLogResourceType.Org,
      organizationId: org.customId,
    });

    fireAndForgetPromise(
      broadcastBlockUpdate(
        context,
        org.customId,
        user.customId,
        { isNew: true },
        org,
        org
      )
    );

    return {
      block: org,
    };
  }

  const rootParent = await context.block.getBlockById(
    context,
    newBlock.rootBlockId
  );

  await canReadBlock({ user, block: rootParent });

  const result = await context.addBlock(context, {
    ...instData,
    data: { block: data },
  });

  const block = result.block;

  context.auditLog.insert(context, instData, {
    action: AuditLogActionType.Create,
    resourceId: block.customId,
    resourceType: getBlockAuditLogResourceType(block),
    organizationId: getBlockRootBlockId(block),
  });

  fireAndForgetPromise(
    broadcastBlockUpdate(
      context,
      block.customId,
      user.customId,
      { isNew: true },
      rootParent,
      block
    )
  );

  // TODO: analyze all the net calls you're making and look for ways to reduce them

  return {
    block,
  };
};

export default addBlock;
