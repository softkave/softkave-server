import { ICustomSelectionOption } from "../../../mongo/custom-property/definitions";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { canReadMultipleOrganizations } from "../../organization/canReadBlock";
import { getPublicCustomSelectionOptionsArray } from "../utils";
import {
    IUpdateManyOptionsEndpointParams,
    UpdateManyOptionsEndpoint,
} from "./types";
import { updateManyOptionsJoiSchema } from "./validation";

const updateManyOptions: UpdateManyOptionsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, updateManyOptionsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const organizationIds: string[] = [];
    const optionIds: string[] = [];
    const optionsUpdateMap: Record<
        string,
        IUpdateManyOptionsEndpointParams["options"][0]["data"]
    > = {};

    data.options.forEach((option) => {
        optionIds.push(option.customId);
        optionsUpdateMap[option.customId] = option.data;
    });

    const options = await Promise.all(
        optionIds.map((id) =>
            context.customSelectionOption.assertGetOptionById(context, id)
        )
    );

    canReadMultipleOrganizations(organizationIds, user);

    // TODO: should we validate that the prev and next ids are valid?
    const promises: Array<Promise<ICustomSelectionOption>> = [];
    options.forEach((option) => {
        if (optionsUpdateMap[option.customId]) {
            promises.push(
                context.customSelectionOption.updateOptionById(
                    context,
                    option.customId,
                    {
                        ...optionsUpdateMap[option.customId],
                        updatedAt: getDate(),
                        updatedBy: user.customId,
                    }
                )
            );
        }
    });

    // TODO: can we separate them so we can reports the ones that failed and the ones that passed
    // or can we revert if some failed
    const updatedOptions = await Promise.all(promises);
    return {
        options: getPublicCustomSelectionOptionsArray(updatedOptions),
    };
};

export default updateManyOptions;
