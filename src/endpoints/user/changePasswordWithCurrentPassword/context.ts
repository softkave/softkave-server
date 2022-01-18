import makeSingletonFn from "../../../utilities/createSingletonFunc";
import BaseContext from "../../contexts/BaseContext";
import { IBaseContext } from "../../contexts/IBaseContext";
import RequestData from "../../RequestData";
import changePassword from "../changePassword/changePassword";
import { IChangePasswordParameters } from "../changePassword/types";
import { IChangePasswordWithCurrentPasswordContext } from "./types";

export default class ChangePasswordWithCurrentPasswordContext
    extends BaseContext
    implements IChangePasswordWithCurrentPasswordContext
{
    public async changePassword(
        context: IBaseContext,
        instData: RequestData<IChangePasswordParameters>
    ) {
        return changePassword(context, instData);
    }
}

export const getChangePasswordWithCurrentPasswordContext = makeSingletonFn(
    () => new ChangePasswordWithCurrentPasswordContext()
);
