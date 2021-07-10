import BaseContext from "../../contexts/BaseContext";
import sendCollaborationRequestsEmail from "../sendCollaborationRequestEmail";
import { IAddCollaboratorsContext } from "./types";

export default class AddCollaboratorsContext
    extends BaseContext
    implements IAddCollaboratorsContext
{
    public async sendCollaborationRequestEmail(props) {
        return sendCollaborationRequestsEmail(props);
    }
}
