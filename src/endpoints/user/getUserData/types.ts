import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { IUser } from "../../../mongo/user";

// tslint:disable-next-line: no-empty-interface
export interface IGetUserDataContext extends IBaseEndpointContext {}

export interface IGetUserDataResult {
  user: IUser;
}
