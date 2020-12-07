import BaseContext from "../../contexts/BaseContext";
import sendCollaborationRequestRevokedEmail from "../sendCollaborationRequestRevokedEmail";
import { IRevokeCollaborationRequestContext } from "./types";

export default class RevokeCollaborationRequestContext
    extends BaseContext
    implements IRevokeCollaborationRequestContext {
    public async sendCollaborationRequestRevokedEmail(props) {
        return sendCollaborationRequestRevokedEmail(props);
    }
}
