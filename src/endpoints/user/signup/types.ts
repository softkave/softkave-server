import { IUser } from "../../../mongo/user";
import {
  CreateRootBlockEndpoint,
  ICreateRootBlockContext,
} from "../../block/createRootBlock/types";
import { Endpoint } from "../../types";
import { ILoginResult } from "../login/types";
import { UserExistsEndpoint } from "../userExists/types";

export interface INewUserInput {
  name: string;
  email: string;
  password: string;
  color: string;
}

export interface ISignupArgData {
  user: INewUserInput;
}

export interface ISignupContext extends ICreateRootBlockContext {
  userExists: UserExistsEndpoint;
  createUserRootBlock: CreateRootBlockEndpoint;
}

export type SignupEndpoint = Endpoint<
  ISignupContext,
  ISignupArgData,
  ILoginResult
>;
