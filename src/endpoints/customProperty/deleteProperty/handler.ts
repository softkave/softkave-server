import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import { fireAndForgetFn } from "../../utils";
import { DeletePropertyEndpoint } from "./types";
import { deletePropertyJoiSchema } from "./validation";

const deleteProperty: DeletePropertyEndpoint = async (context, instData) => {
    const data = validate(instData.data, deletePropertyJoiSchema);
    const user = await context.session.getUser(context, instData);
    const property = await context.customProperty.getItemById(
        context,
        data.customId
    );

    canReadOrganization(property.organizationId, user);
    await context.customProperty.deleteItemById(context, property.customId);
    fireAndForgetFn(() => {
        context.customPropertyValue.bulkDeleteItemsByField(
            context,
            "propertyId",
            property.customId
        );
    });
};

export default deleteProperty;
