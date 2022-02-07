import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface IUserExistsParameters {
    email: string;
}

export type UserExistsEndpoint = Endpoint<
    IBaseContext,
    IUserExistsParameters,
    { exists: boolean }
>;
