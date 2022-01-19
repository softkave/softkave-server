import assert from "assert";
import { makeAddCollaboratorContext } from "../../collaborationRequest/addCollaborators/context";
import addCollaborators from "../../collaborationRequest/addCollaborators/handler";
import {
    IAddCollaboratorsParameters,
    INewCollaboratorInput,
} from "../../collaborationRequest/addCollaborators/types";
import { IBaseContext } from "../../contexts/IBaseContext";
import { IServerRequest } from "../../contexts/types";
import RequestData from "../../RequestData";
import { chance } from "../data/data";
import { assertResultOk } from "../utils";

export async function setupTestCollaborationRequestWithEndpoint(
    context: IBaseContext,
    req: IServerRequest,
    orgId: string,
    input: Partial<INewCollaboratorInput>[] = [],
    count = 2
) {
    input =
        input.length < count
            ? input.concat(Array(count - input.length))
            : input;

    const result = await addCollaborators(
        makeAddCollaboratorContext(context),
        RequestData.fromExpressRequest<IAddCollaboratorsParameters>(
            context,
            req,
            {
                organizationId: orgId,
                collaborators: input.map((item) => ({
                    email: chance.email(),
                    ...item,
                })),
            }
        )
    );

    assertResultOk(result);
    assert.ok(result.requests);
    return {
        requests: result.requests,
    };
}
