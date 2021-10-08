import makeSingletonFn from "../../../utilities/createSingletonFunc";
import BaseContext, { IBaseContext } from "../../contexts/BaseContext";
import RequestData from "../../RequestData";
import changePassword from "../changePassword/changePassword";
import { IChangePasswordParameters } from "../changePassword/types";
import { IChangePasswordWithTokenContext } from "./types";

export default class ChangePasswordWithTokenContext
    extends BaseContext
    implements IChangePasswordWithTokenContext
{
    public async changePassword(
        context: IBaseContext,
        instData: RequestData<IChangePasswordParameters>
    ) {
        return changePassword(context, instData);
    }
}

export const getChangePasswordWithTokenContext = makeSingletonFn(
    () => new ChangePasswordWithTokenContext()
);
