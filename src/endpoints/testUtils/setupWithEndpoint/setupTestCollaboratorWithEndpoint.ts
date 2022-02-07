import assert from "assert";
import { CollaborationRequestStatusType } from "../../../mongo/collaboration-request";
import { IToken } from "../../../mongo/token";
import { makeAddCollaboratorContext } from "../../collaborationRequest/addCollaborators/context";
import addCollaborators from "../../collaborationRequest/addCollaborators/handler";
import { IAddCollaboratorsParameters } from "../../collaborationRequest/addCollaborators/types";
import respondToRequest from "../../collaborationRequest/respondToRequest/handler";
import { IRespondToCollaborationRequestParameters } from "../../collaborationRequest/respondToRequest/types";
import { IBaseContext } from "../../contexts/IBaseContext";
import { IServerRequest } from "../../contexts/types";
import RequestData from "../../RequestData";
import { setupTestExpressRequestWithToken } from "../setupTestExpressRequest";
import { assertResultOk } from "../utils";

export async function setupTestCollaboratorWithEndpoint(
    context: IBaseContext,
    req: IServerRequest,
    orgId: string,
    email: string,
    token: IToken
) {
    const result01 = await addCollaborators(
        makeAddCollaboratorContext(context),
        RequestData.fromExpressRequest<IAddCollaboratorsParameters>(
            context,
            req,
            {
                organizationId: orgId,
                collaborators: [{ email }],
            }
        )
    );

    assertResultOk(result01);
    assert.ok(result01.requests);

    const result02 = await respondToRequest(
        context,
        RequestData.fromExpressRequest<IRespondToCollaborationRequestParameters>(
            context,
            setupTestExpressRequestWithToken({ token }).req,
            {
                requestId: result01.requests[0].customId,
                response: CollaborationRequestStatusType.Accepted,
            }
        )
    );

    assertResultOk(result02);
}
