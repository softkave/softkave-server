import BaseContext from "../../contexts/BaseContext";
import sendCollabReqEmail from "../sendCollaborationRequestEmail";
import { IAddCollaboratorsContext } from "./types";

export default class AddCollaboratorsContext
    extends BaseContext
    implements IAddCollaboratorsContext
{
    // @ts-ignore
    public async sendCollaborationRequestEmail(props) {
        // return sendCollabReqEmail(props);
    }
}
