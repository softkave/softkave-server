import { IBlock } from "../../../mongo/block";
import { CollaborationRequestResponse } from "../../../mongo/notification";
import { IPublicBlock } from "../../block/types";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IRespondToCollaborationRequestParameters {
    requestId: string;
    response: CollaborationRequestResponse;
}
export interface IRespondToCollaborationRequestResult {
    block?: IPublicBlock;
    respondedAt: string;
}

export type RespondToCollaborationRequestEndpoint = Endpoint<
    IBaseContext,
    IRespondToCollaborationRequestParameters,
    IRespondToCollaborationRequestResult
>;
