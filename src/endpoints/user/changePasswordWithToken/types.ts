import BaseContext, { IBaseContext } from "../../contexts/BaseContext";
import RequestData from "../../contexts/RequestData";
import { Endpoint } from "../../types";
import {
  IChangePasswordParameters,
  IChangePasswordResult,
} from "../changePassword/types";
import ChangePasswordWithTokenContext from "./context";

export interface IChangePasswordWithTokenContext extends IBaseContext {
  changePassword: (
    context: BaseContext,
    instData: RequestData<IChangePasswordParameters>
  ) => Promise<IChangePasswordResult>;
}

export type ChangePasswordWithTokenEndpoint = Endpoint<
  ChangePasswordWithTokenContext,
  IChangePasswordParameters,
  IChangePasswordResult
>;
