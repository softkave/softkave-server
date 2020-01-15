import { IUser } from "../../../mongo/user";
import { IBaseEndpointContext } from "../../BaseEndpointContext";

export interface INewUserInput {
  name: string;
  email: string;
  password: string;
  color: string;
}

export interface ISignupContext extends IBaseEndpointContext {
  data: INewUserInput;
  userExists: (email: string) => Promise<boolean>;
  saveUser: (user: INewUser) => Promise<IUser>;
  createUserRootBlock: (user: IUser) => Promise<string>;
}

export interface INewUser {
  customId: string;
  hash: string;
  name: string;
  email: string;
  color: string;
}

export interface ISignupResult {
  user: IUser;
  token: string;
}
