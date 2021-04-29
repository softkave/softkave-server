import { IPublicClient } from "../../client/types";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicUserData } from "../types";

export interface IGetUserDataResult {
    user: IPublicUserData;
    client: IPublicClient;
}

export type GetUserDataEndpoint = Endpoint<
    IBaseContext,
    undefined,
    IGetUserDataResult
>;
