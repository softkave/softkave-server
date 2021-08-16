import { IBlock } from "../../../mongo/block/definitions";
import { IUser } from "../../../mongo/user/definitions";
import getSingletonFunc from "../../../utilities/createSingletonFunc";
import {
    initializeBoardPermissions,
    initializeOrganizationAccessControl,
} from "../../accessControl/initializeBlockPermissions";
import BaseContext, { IBaseContext } from "../../contexts/BaseContext";
import { wrapFireAndThrowErrorAsync } from "../../utils";
import { IInternalAddBlockContext } from "./types";

export default class InternalAddBlockContext
    extends BaseContext
    implements IInternalAddBlockContext
{
    public initializeBoardPermissions = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, user: IUser, block: IBlock) => {
            return initializeBoardPermissions(ctx, user, block);
        }
    );

    public initializeOrganizationAccessControl = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, user: IUser, block: IBlock) => {
            return initializeOrganizationAccessControl(ctx, user, block);
        }
    );
}

export const getInternalAddBlockContext = getSingletonFunc(
    () => new InternalAddBlockContext()
);
