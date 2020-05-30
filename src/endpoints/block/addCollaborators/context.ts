import BaseContext from "../../contexts/BaseContext";
import sendCollabReqEmail from "../sendCollabRequestEmail";
import { IAddCollaboratorsContext } from "./types";

export default class AddCollaboratorsContext extends BaseContext
  implements IAddCollaboratorsContext {
  public async sendCollaborationRequestEmail(props) {
    return sendCollabReqEmail(props);
  }
}
