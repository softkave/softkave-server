import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import ReusableDataQueries from "../../ReuseableDataQueries";
import CustomDataQueries from "../CustomDataQueries";
import ToPublicCustomData from "../utils";
import { UpdatePropertyEndpoint } from "./types";
import { updatePropertyEndpointJoiSchema } from "./validation";

const updateProperty: UpdatePropertyEndpoint = async (context, instData) => {
    const data = validate(instData.data, updatePropertyEndpointJoiSchema);
    const user = await context.session.getUser(context, instData);
    const property = await context.data.customProperty.assertGetItem(
        ReusableDataQueries.byId(data.customId)
    );

    canReadOrganization(property.organizationId, user);
    const updatedProperty = await context.data.customProperty.assertUpdateItem(
        ReusableDataQueries.byId(data.customId),
        {
            ...data.property,
            updatedAt: getDate(),
            updatedBy: user.customId,
        }
    );

    // TODO: delete values' values on type change or convert to the new type if possible?
    if (property.type !== updatedProperty.type) {
        await context.data.customProperty.deleteManyItems(
            CustomDataQueries.byPropertyId(property.customId)
        );
    }

    return {
        property: ToPublicCustomData.customProperty(updatedProperty),
    };
};

export default updateProperty;
