import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetChangePasswordTokenDataResult {
  email: string;
  issuedAt: number;
  expires: number;
}

export type GetChangePasswordTokenDataEndpoint = Endpoint<
  IBaseContext,
  undefined,
  IGetChangePasswordTokenDataResult
>;
