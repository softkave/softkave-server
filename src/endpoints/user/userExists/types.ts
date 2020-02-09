import { IBaseEndpointContext } from "../../BaseEndpointContext";

export interface IUserExistsParameters {
  email: string;
}

export interface IUserExistsContext extends IBaseEndpointContext {
  data: IUserExistsParameters;
  doesUserExistInDatabase: (email: string) => Promise<boolean>;
}
