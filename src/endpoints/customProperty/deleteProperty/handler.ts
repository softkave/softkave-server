import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import { fireAndForgetFn } from "../../utils";
import { DeletePropertyEndpoint } from "./types";
import { deletePropertyJoiSchema } from "./validation";

const deleteProperty: DeletePropertyEndpoint = async (context, instData) => {
    const data = validate(instData.data, deletePropertyJoiSchema);
    const user = await context.session.getUser(context, instData);
    const property = await context.customProperty.assertGetCustomPropertyById(
        context,
        data.customId
    );

    canReadOrganization(property.organizationId, user);
    await context.customProperty.deleteCustomProperty(
        context,
        property.customId
    );

    fireAndForgetFn(() => {
        context.customPropertyValue.deleteManyByPropertyId(
            context,

            property.customId
        );
    });
};

export default deleteProperty;
