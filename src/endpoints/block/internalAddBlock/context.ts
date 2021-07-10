import { IBlock } from "../../../mongo/block/definitions";
import { IUser } from "../../../mongo/user/definitions";
import makeSingletonFunc from "../../../utilities/createSingletonFunc";
import {
    initializeBoardPermissions,
    initializeOrgAccessControl,
} from "../../accessControl/initializeBlockPermissions";
import BaseContext, { IBaseContext } from "../../contexts/BaseContext";
import { wrapFireAndThrowError } from "../../utils";
import { IInternalAddBlockContext } from "./types";

export default class InternalAddBlockContext
    extends BaseContext
    implements IInternalAddBlockContext
{
    public initializeBoardPermissions = wrapFireAndThrowError(
        (ctx: IBaseContext, user: IUser, block: IBlock) => {
            return initializeBoardPermissions(ctx, user, block);
        }
    );

    public initializeOrgAccessControl = wrapFireAndThrowError(
        (ctx: IBaseContext, user: IUser, block: IBlock) => {
            return initializeOrgAccessControl(ctx, user, block);
        }
    );
}

export const getInternalAddBlockContext = makeSingletonFunc(
    () => new InternalAddBlockContext()
);
