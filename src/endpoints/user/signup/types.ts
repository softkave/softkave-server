import { IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { IBaseEndpointContext } from "../../BaseEndpointContext";

export interface INewUserInput {
  name: string;
  email: string;
  password: string;
  color: string;
}

export interface ISignupArgData {
  user: INewUserInput;
}

export interface ISignupContext extends IBaseEndpointContext {
  data: ISignupArgData;
  userExists: (email: string) => Promise<boolean>;
  saveUser: (user: INewUser) => Promise<IUser>;
  createUserRootBlock: () => Promise<IBlock>;
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
