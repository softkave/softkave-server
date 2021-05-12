import makeSingletonFunc from "../../../utilities/createSingletonFunc";
import BaseContext from "../../contexts/BaseContext";
import changePassword from "../changePassword/changePassword";
import { IUpdateUserEndpointContext } from "./types";

export default class UpdateUserEndpointContext
    extends BaseContext
    implements IUpdateUserEndpointContext
{
    public async changePassword(context, instData) {
        return await changePassword(context, instData);
    }
}

export const getUpdateUserEndpointContext = makeSingletonFunc(
    () => new UpdateUserEndpointContext()
);
