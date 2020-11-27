import {
    CreateRootBlockEndpoint,
    ICreateRootBlockContext,
} from "../../block/createRootBlock/types";
import { Endpoint } from "../../types";
import { ILoginResult } from "../login/types";

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
    createUserRootBlock: CreateRootBlockEndpoint;
}

export type SignupEndpoint = Endpoint<
    ISignupContext,
    ISignupArgData,
    ILoginResult
>;
