import { SystemActionType, SystemResourceType } from "../../models/system";
import { BlockType, IBlock } from "../../mongo/block";
import { IUser } from "../../mongo/user";
import { getBlockRootBlockId } from "../block/utils";
import { IBaseContext } from "../contexts/BaseContext";
import { InvalidRequestError } from "../errors";
import RequestData from "../RequestData";
import { fireAndForgetPromise } from "../utils";

export interface IAccessControlGetCheckResult {
    block: IBlock;
    user: IUser;
}

export default async function accessControlGetCheck(
    context: IBaseContext,
    instData: RequestData,
    blockId: string,
    resourceType: SystemResourceType,
    action: SystemActionType
): Promise<IAccessControlGetCheckResult> {
    const user = await context.session.getUser(context, instData);
    const block = await context.block.assertGetBlockById(context, blockId);

    if (block.type !== BlockType.Org && block.type !== BlockType.Board) {
        throw new InvalidRequestError();
    }

    await context.accessControl.queryPermission(
        context,
        block.rootBlockId || block.customId,
        {
            resourceType,
            action,
            resourceId: block.customId,
        },
        user
    );

    // TODO: the operation may fail, but we are still loggin it here
    // should we do something about it, like wait until the end of the operation?
    fireAndForgetPromise(
        context.auditLog.insert(context, instData, {
            resourceType,
            action,
            organizationId: getBlockRootBlockId(block),
            resourceOwnerId: block.customId,
            userId: user.customId,
        })
    );

    return { block, user };
}
