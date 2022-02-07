import { IBaseContext } from "../../contexts/IBaseContext";
import RequestData from "../../RequestData";
import { Endpoint } from "../../types";
import { IChangePasswordParameters } from "../changePassword/types";
import { ILoginResult } from "../login/types";

export interface IChangePasswordWithCurrentPasswordEndpointParams {
    currentPassword: string;
    password: string;
}

export interface IChangePasswordWithCurrentPasswordContext
    extends IBaseContext {
    changePassword: (
        context: IBaseContext,
        instData: RequestData<IChangePasswordParameters>
    ) => Promise<ILoginResult>;
}

export type ChangePasswordWithCurrentPasswordEndpoint = Endpoint<
    IChangePasswordWithCurrentPasswordContext,
    IChangePasswordWithCurrentPasswordEndpointParams,
    ILoginResult
>;
