import IBaseContext from "../../contexts/BaseContext";
import sendCollabReqEmail from "../sendCollaborationRequestEmail";
import { IAddCollaboratorsContext } from "./types";

export default class AddCollaboratorsContext
    extends IBaseContext
    implements IAddCollaboratorsContext {
    public async sendCollaborationRequestEmail(props) {
        return sendCollabReqEmail(props);
    }
}
