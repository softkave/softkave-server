import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IUserExistsParameters {
    email: string;
}

export type UserExistsEndpoint = Endpoint<
    IBaseContext,
    IUserExistsParameters,
    boolean
>;
