import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";

// tslint:disable-next-line: no-empty-interface
export interface IGetChangePasswordTokenDataContext
  extends IBaseEndpointContext {}

export interface IGetChangePasswordTokenDataResult {
  email: string;
  issuedAt: number;
  expires: number;
}
