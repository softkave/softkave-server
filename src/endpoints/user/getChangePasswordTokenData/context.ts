import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "../../BaseEndpointContext";
import { IGetChangePasswordTokenDataContext } from "./types";

// tslint:disable-next-line: no-empty-interface
export interface IGetChangePasswordTokenDataContextParameters
  extends IBaseEndpointContextParameters {}

export default class GetChangePasswordTokenDataContext
  extends BaseEndpointContext
  implements IGetChangePasswordTokenDataContext {
  constructor(p: IGetChangePasswordTokenDataContextParameters) {
    super(p);
  }
}
