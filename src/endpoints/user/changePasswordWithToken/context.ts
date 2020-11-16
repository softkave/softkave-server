import createSingletonFunc from "../../../utilities/createSingletonFunc";
import IBaseContext from "../../contexts/BaseContext";
import RequestData from "../../RequestData";
import changePassword from "../changePassword/changePassword";
import { IChangePasswordParameters } from "../changePassword/types";
import { IChangePasswordWithTokenContext } from "./types";

export default class ChangePasswordWithTokenContext
    extends IBaseContext
    implements IChangePasswordWithTokenContext {
    public async changePassword(
        context: IBaseContext,
        instData: RequestData<IChangePasswordParameters>
    ) {
        return changePassword(context, instData);
    }
}

export const getChangePasswordWithTokenContext = createSingletonFunc(
    () => new ChangePasswordWithTokenContext()
);
