import { IUser } from "../../../mongo/user";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetUserDataResult {
  user: IUser;
  clientId: string;
}

export type GetUserDataEndpoint = Endpoint<
  IBaseContext,
  undefined,
  IGetUserDataResult
>;
