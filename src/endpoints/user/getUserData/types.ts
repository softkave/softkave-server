import { IUser } from "../../../mongo/user";
import { IBaseEndpointContext } from "../../BaseEndpointContext";

// tslint:disable-next-line: no-empty-interface
export interface IGetUserDataContext extends IBaseEndpointContext {}

export interface IGetUserDataResult {
  user: IUser;
}
