import { Request } from "express";
import {
  IBaseUserTokenData,
  IUserTokenSubject,
} from "../endpoints/user/UserToken";
import { IUser } from "../mongo/user";

export type DataType = "string" | "number" | "array";

export interface IServerRequest extends Request {
  user?: IBaseUserTokenData;
  userData?: IUser;
}
