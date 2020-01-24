import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { IAddCollaboratorsContext, IAddCollaboratorsParameters } from "./types";

export interface IAddCollaboratorsContextParameters
  extends IBaseEndpointContextParameters {
  data: IAddCollaboratorsParameters;
}

export default class AddCollaboratorsContext extends BaseEndpointContext
  implements IAddCollaboratorsContext {
  public data: IAddCollaboratorsParameters;

  constructor(p: IAddCollaboratorsContextParameters) {
    super(p);
    this.data = p.data;
  }
}
