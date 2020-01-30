import { Moment } from "moment";
import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";

export interface ISendChangePasswordEmailParameters {
  emailAddress: string;
  query: any;
  expiration: Moment;
}

export interface ISendChangePasswordEmailContext extends IBaseEndpointContext {
  data: ISendChangePasswordEmailParameters;
  sendChangePasswordEmail: (
    emailAddress: string,
    query: any,
    expiration: Moment
  ) => Promise<any>;
}
