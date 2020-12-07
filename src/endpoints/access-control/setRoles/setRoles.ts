import { SystemActionType, SystemResourceType } from "../../../models/system";
import { IAccessControlRole } from "../../../mongo/access-control/definitions";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { BlockType, IBlock } from "../../../mongo/block";
import { getDefaultConnection } from "../../../mongo/defaultConnection";
import { IUser } from "../../../mongo/user";
import { getDate, getDateString } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import OperationError from "../../../utilities/OperationError";
import waitOnPromises, {
    IPromiseWithId,
} from "../../../utilities/waitOnPromises";
import { getBlockRootBlockId } from "../../block/utils";
import { InvalidRequestError } from "../../errors";
import { getPublicRoleData } from "../utils";
import {
    IRoleInput,
    ISetRolesEndpointParameters,
    ISetRolesEndpointResult,
    SetRolesEndpoint,
} from "./types";
import { setRolesJoiSchema } from "./validation";

interface IProcessPermissionsExtraArgs {
    user: IUser;
    block: IBlock;
}

// TODO: validate that name is unique, and that new roles are not using "public"
// TODO: check that the "public" role's name is not being updated, description can be updated

function processUpdateRoleInput(
    roleInput: Partial<IRoleInput>,
    args: IProcessPermissionsExtraArgs
) {
    const role: Partial<IAccessControlRole> = {
        ...roleInput,
        updatedAt: getDate(),
        updatedBy: args.user.customId,
    };

    return role;
}

function processNewRoleInput(
    roleInput: IRoleInput,
    args: IProcessPermissionsExtraArgs
) {
    const role: IAccessControlRole = {
        ...roleInput,
        createdAt: getDate(),
        createdBy: args.user.customId,
        customId: getNewId(),
        lowerCasedName: roleInput.name.toLowerCase(),
        resourceId: args.block.customId,
        resourceType: getBlockAuditLogResourceType(args.block),
    };

    return role;
}

function processInput(
    data: ISetRolesEndpointParameters["roles"],
    args: IProcessPermissionsExtraArgs
) {
    const add = data.add || [];
    const addIdMap: Record<string, string> = {};
    const update = data.update || [];
    const remove = data.remove || [];

    const processedAdd = add.map((d) => {
        const role = processNewRoleInput(d.data, args);

        addIdMap[role.customId] = d.tempId;

        return role;
    });

    const processedUpdate = update.map((d) => {
        return {
            id: d.customId,
            data: processUpdateRoleInput(d.data, args),
        };
    });

    return {
        addIdMap,
        remove,
        add: processedAdd,
        update: processedUpdate,
    };
}

const setRoles: SetRolesEndpoint = async (context, instData) => {
    const data = validate(instData.data, setRolesJoiSchema);

    const user = await context.session.getUser(context, instData);
    const block = await context.block.assertGetBlockById(context, data.blockId);

    if (block.type !== BlockType.Org && block.type !== BlockType.Board) {
        throw new InvalidRequestError();
    }

    await context.accessControl.assertPermission(
        context,
        getBlockRootBlockId(block),
        {
            resourceType: SystemResourceType.Permission,
            action: SystemActionType.Update,
            permissionResourceId: block.permissionResourceId,
        },
        user
    );

    const processArgs: IProcessPermissionsExtraArgs = { user, block };
    const { add, addIdMap, update, remove } = processInput(
        data.roles,
        processArgs
    );

    const addPromiseId = "add";
    const updatePromiseId = "update";
    const removePromiseId = "remove";

    const promises: IPromiseWithId[] = [];

    // TODO: all mongodb session operations should be abstracted away
    const session = await getDefaultConnection().getConnection().startSession();
    session.startTransaction();

    if (add.length > 0) {
        promises.push({
            id: addPromiseId,
            promise: context.accessControl.saveRoles(context, add),
        });
    }

    if (update.length > 0) {
        promises.push({
            id: updatePromiseId,
            promise: context.accessControl.bulkUpdateRolesById(context, update),
        });
    }

    if (remove.length > 0) {
        promises.push({
            id: removePromiseId,
            promise: context.accessControl.deleteRoles(context, remove),
        });
    }

    const settledPromises = await waitOnPromises(promises);
    let completedAdd: ISetRolesEndpointResult["added"] = [];
    let completedUpdate: ISetRolesEndpointResult["updated"] = [];

    settledPromises.forEach((p) => {
        if (p.rejected) {
            session.abortTransaction();
            throw new OperationError({
                message: "Error completing request",
            });
        }

        if (p.id === addPromiseId) {
            completedAdd = (p.value! as IAccessControlRole[]).map((role) => {
                return {
                    tempId: addIdMap[role.customId],
                    role: getPublicRoleData(role),
                };
            });
        }

        if (p.id === updatePromiseId) {
            completedUpdate = update.map((input) => {
                return {
                    customId: input.id,
                    updatedAt: getDateString(input.data.updatedAt),
                    updatedBy: input.data.updatedBy,
                };
            });
        }
    });

    // await session.commitTransaction()
    session.endSession();

    return {
        added: completedAdd,
        updated: completedUpdate,
    };
};

export default setRoles;
