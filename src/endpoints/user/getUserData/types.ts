import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicUserData } from "../types";

export interface IGetUserDataResult {
    user: IPublicUserData;
    clientId: string;
}

export type GetUserDataEndpoint = Endpoint<
    IBaseContext,
    undefined,
    IGetUserDataResult
>;
