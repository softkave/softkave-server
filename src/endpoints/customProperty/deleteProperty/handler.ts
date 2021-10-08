import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import ReusableDataQueries from "../../ReuseableDataQueries";
import { fireAndForgetFn } from "../../utils";
import CustomDataQueries from "../CustomDataQueries";
import { DeletePropertyEndpoint } from "./types";
import { deletePropertyJoiSchema } from "./validation";

const deleteProperty: DeletePropertyEndpoint = async (context, instData) => {
    const data = validate(instData.data, deletePropertyJoiSchema);
    const user = await context.session.getUser(context, instData);
    const property = await context.data.customProperty.assertGetItem(
        ReusableDataQueries.byId(data.customId)
    );

    canReadOrganization(property.organizationId, user);
    await context.data.customProperty.deleteItem(
        ReusableDataQueries.byId(data.customId)
    );

    fireAndForgetFn(() => {
        context.data.customValue.deleteManyItems(
            CustomDataQueries.byPropertyId(data.customId)
        );
    });

    fireAndForgetFn(() => {
        context.data.customOption.deleteManyItems(
            CustomDataQueries.byPropertyId(data.customId)
        );
    });
};

export default deleteProperty;
