import { IPublicClient } from "../../client/types";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { ILoginResult } from "../login/types";
import { IPublicUserData } from "../types";

export type GetUserDataEndpoint = Endpoint<
    IBaseContext,
    undefined,
    ILoginResult
>;
