import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetChangePasswordTokenDataResult {
  email: string;
  issuedAt: string;
  expires: string;
}

export type GetChangePasswordTokenDataEndpoint = Endpoint<
  IBaseContext,
  undefined,
  IGetChangePasswordTokenDataResult
>;
