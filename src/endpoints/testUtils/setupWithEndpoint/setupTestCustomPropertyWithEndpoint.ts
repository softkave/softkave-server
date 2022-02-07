import assert from "assert";
import { merge } from "lodash";
import {
    CustomPropertyType,
    TextResourceTypes,
} from "../../../mongo/custom-property/definitions";
import { IParentInformation } from "../../../mongo/definitions";
import { IBaseContext } from "../../contexts/IBaseContext";
import { IServerRequest } from "../../contexts/types";
import createProperty from "../../customProperty/createProperty/handler";
import { ICreatePropertyEndpointParams } from "../../customProperty/createProperty/types";
import RequestData from "../../RequestData";
import { chance } from "../data/data";
import { assertResultOk } from "../utils";

export async function setupTestCustomPropertyWithEndpoint(
    context: IBaseContext,
    req: IServerRequest,
    parent: IParentInformation,
    base: Partial<ICreatePropertyEndpointParams["property"]> = {}
) {
    const result = await createProperty(
        context,
        RequestData.fromExpressRequest<ICreatePropertyEndpointParams>(
            context,
            req,
            {
                parent,
                property: {
                    name: chance.word(),
                    description: chance.sentence({ words: 5 }),
                    type: CustomPropertyType.Text,
                    isRequired: true,
                    meta: merge(
                        {
                            minChars: 10,
                            maxChars: 100,
                            defaultText: chance.word(),
                            type: TextResourceTypes.Text,
                        },
                        base.meta
                    ),

                    ...base,
                },
            }
        )
    );

    assertResultOk(result);
    assert.ok(result.property);
    return {
        property: result.property,
    };
}
