import makeSingletonFn from "../../../utilities/createSingletonFunc";
import BaseContext from "../../contexts/BaseContext";
import sendCollaborationRequestRevokedEmail from "../sendCollaborationRequestRevokedEmail";
import { IRevokeCollaborationRequestContext } from "./types";

// @ts-ignore
export default class RevokeCollaborationRequestContext
    extends BaseContext
    implements IRevokeCollaborationRequestContext
{
    public async sendCollaborationRequestRevokedEmail(props) {
        return sendCollaborationRequestRevokedEmail(props);
    }
}

export const getRevokeCollaborationRequestContext = makeSingletonFn(
    () => new RevokeCollaborationRequestContext()
);
