import {
    ICustomPropertyValue,
    ISelectionCustomTypeValue,
} from "../../../mongo/custom-property/definitions";
import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import ReusableDataQueries from "../../ReuseableDataQueries";
import { fireAndForgetFn } from "../../utils";
import CustomDataQueries from "../CustomDataQueries";
import { DeleteOptionEndpoint } from "./types";
import { deleteOptionJoiSchema } from "./validation";

const deleteOption: DeleteOptionEndpoint = async (context, instData) => {
    const data = validate(instData.data, deleteOptionJoiSchema);
    const user = await context.session.getUser(context, instData);
    const option = await context.data.customOption.assertGetItem(
        ReusableDataQueries.byId(data.customId)
    );

    canReadOrganization(option.organizationId, user);
    await context.data.customOption.deleteItem(
        ReusableDataQueries.byId(data.customId)
    );

    fireAndForgetFn(async () => {
        context.data.entityAttrValue.deleteManyItems(
            CustomDataQueries.bySelectionValue(option.customId)
        );
    });
};

export default deleteOption;
