import makeSingletonFn from "../../../utilities/createSingletonFunc";
import BaseContext from "../../contexts/BaseContext";
import sendCollaborationRequestRevokedEmail from "../sendCollaborationRequestRevokedEmail";
import { IRevokeCollaborationRequestContext } from "./types";

export default class RevokeCollaborationRequestContext
    extends BaseContext
    implements IRevokeCollaborationRequestContext
{
    public async sendCollaborationRequestRevokedEmail(context, props) {
        return sendCollaborationRequestRevokedEmail(context, props);
    }
}

export const getRevokeCollaborationRequestContext = makeSingletonFn(
    () => new RevokeCollaborationRequestContext()
);
