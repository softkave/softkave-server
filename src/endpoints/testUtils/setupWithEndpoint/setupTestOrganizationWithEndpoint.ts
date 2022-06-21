import assert from "assert";
import { IBaseContext } from "../../contexts/IBaseContext";
import { IServerRequest } from "../../contexts/types";
import createOrganization from "../../organizations/createOrganization/handler";
import { ICreateOrganizationParameters } from "../../organizations/createOrganization/types";
import { INewOrganizationInput } from "../../organizations/types";
import RequestData from "../../RequestData";
import { chance } from "../data/data";
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
          description: chance.sentence({ words: 10 }),
          color: chance.color({ format: "hex" }),
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
