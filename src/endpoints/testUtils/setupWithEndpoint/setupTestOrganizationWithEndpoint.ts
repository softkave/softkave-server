import assert from "assert";
import { IBaseContext } from "../../contexts/BaseContext";
import { IServerRequest } from "../../contexts/types";
import createOrganization from "../../organization/createOrganization/handler";
import { ICreateOrganizationParameters } from "../../organization/createOrganization/types";
import { INewOrganizationInput } from "../../organization/types";
import RequestData from "../../RequestData";
import { chance } from "../data";
import { assertResultOk } from "../utils";

export async function setupTestOrganizationWithEndpoint(
    context: IBaseContext,
    req: IServerRequest,
    base: Partial<INewOrganizationInput> = {}
) {
    const result = await createOrganization(
        context,
        RequestData.fromExpressRequest<ICreateOrganizationParameters>(
            context,
            req,
            {
                organization: {
                    name: chance.company(),
                    description: chance.paragraph(),
                    color: chance.color(),
                    ...base,
                },
            }
        )
    );

    assertResultOk(result);
    assert.ok(result.organization);
    return {
        organization: result.organization,
    };
}
