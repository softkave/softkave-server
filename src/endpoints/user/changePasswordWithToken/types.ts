import BaseContext, { IBaseContext } from "../../contexts/BaseContext";
import RequestData from "../../contexts/RequestData";
import { Endpoint } from "../../types";
import { IChangePasswordParameters } from "../changePassword/types";
import { ILoginResult } from "../login/types";
import ChangePasswordWithTokenContext from "./context";

export interface IChangePasswordWithTokenContext extends IBaseContext {
  changePassword: (
    context: BaseContext,
    instData: RequestData<IChangePasswordParameters>
  ) => Promise<ILoginResult>;
}

export type ChangePasswordWithTokenEndpoint = Endpoint<
  ChangePasswordWithTokenContext,
  IChangePasswordParameters,
  ILoginResult
>;
