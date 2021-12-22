import { validate } from "../../../utilities/joiUtils";
import CustomDataQueries from "../CustomDataQueries";
import { IPublicCustomPropertyValue } from "../types";
import ToPublicCustomData from "../utils";
import { GetValuesEndpoint } from "./types";
import { getResourceSubscriptionsJoiSchema } from "./validation";

const getValues: GetValuesEndpoint = async (context, instData) => {
    const data = validate(instData.data, getResourceSubscriptionsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const values = await context.data.customValue.getManyItems(
        CustomDataQueries.byParents(data.parents)
    );

    const userOrganizationsMap: Record<string, true> =
        user.orgs.reduce((map, organization) => {
            map[organization.customId] = true;
            return map;
        }, {} as Record<string, true>);

    const permittedValues: IPublicCustomPropertyValue[] = [];
    values.forEach((value) => {
        if (userOrganizationsMap[value.organizationId]) {
            permittedValues.push(ToPublicCustomData.customValue(value));
        }
    });

    return { values: permittedValues };
};

export default getValues;
