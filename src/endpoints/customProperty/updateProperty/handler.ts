import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import { getPublicCustomProperty } from "../utils";
import { UpdatePropertyEndpoint } from "./types";
import { updatePropertyEndpointJoiSchema } from "./validation";

const updateProperty: UpdatePropertyEndpoint = async (context, instData) => {
    const data = validate(instData.data, updatePropertyEndpointJoiSchema);
    const user = await context.session.getUser(context, instData);
    const property = await context.customProperty.assertGetCustomPropertyById(
        context,
        data.customId
    );

    canReadOrganization(property.organizationId, user);
    const updatedProperty =
        await context.customProperty.updateCustomPropertyById(
            context,
            data.customId,
            {
                ...data.property,
                updatedAt: getDate(),
                updatedBy: user.customId,
            }
        );

    // TODO: delete values' values on type change or convert to the new type if possible?
    // TODO: apply new limits and constraints on meta change
    if (property.type !== updatedProperty.type) {
    }

    return {
        // TODO: what happens when the return value is null cause the item has been deleted?
        property: getPublicCustomProperty(updatedProperty),
    };
};

export default updateProperty;
