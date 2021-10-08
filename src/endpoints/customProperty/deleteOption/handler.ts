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
        context.data.customValue.deleteManyItems(
            CustomDataQueries.byPropertyId(data.customId)
        );

        let values: ICustomPropertyValue[] = [];

        do {
            values = await context.data.customValue.getManyItems(
                CustomDataQueries.byPropertyId(data.customId),
                { limit: 50 }
            );

            const updatedValues = values.map((value) => {
                const i = (
                    value.value as ISelectionCustomTypeValue
                )?.value?.indexOf(option.customId);

                if (i !== -1) {
                }
            });
        } while (values.length > 0);
    });
};

export default deleteOption;
