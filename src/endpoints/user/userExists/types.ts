import { IBaseEndpointContext } from "../../BaseEndpointContext";

export interface IUserExistsInput {
  email: string;
}

export interface IUserExistsContext extends IBaseEndpointContext {
  data: IUserExistsInput;
  doesUserExistInDatabase: (email: string) => Promise<boolean>;
}
