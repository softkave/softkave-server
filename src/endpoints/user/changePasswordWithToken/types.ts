import BaseContext, { IBaseContext } from "../../contexts/BaseContext";
import { IEndpointInstanceData } from "../../contexts/types";
import { Endpoint } from "../../types";
import {
  IChangePasswordParameters,
  IChangePasswordResult,
} from "../changePassword/types";
import ChangePasswordWithTokenContext from "./context";

export interface IChangePasswordWithTokenContext extends IBaseContext {
  changePassword: (
    context: BaseContext,
    instData: IEndpointInstanceData<IChangePasswordParameters>
  ) => Promise<IChangePasswordResult>;
}

export type ChangePasswordWithTokenEndpoint = Endpoint<
  ChangePasswordWithTokenContext,
  IChangePasswordParameters,
  IChangePasswordResult
>;
