import {
    CustomPropertyType,
    ICustomSelectionOption,
    ISelectionCustomTypeMeta,
    SelectionResourceTypes,
} from "../../../mongo/custom-property/definitions";
import cast, { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { InvalidRequestError } from "../../errors";
import canReadOrganization from "../../organization/canReadBlock";
import { CustomSelectionOptionExistsError } from "../errors";
import {
    getPublicCustomSelectionOption,
    throwCustomPropertyNotFoundError,
} from "../utils";
import { CreateCustomSelectionOptionEndpoint } from "./types";
import { createCustomSelectionOptionJoiSchema } from "./validation";

const createCustomSelectionOption: CreateCustomSelectionOptionEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, createCustomSelectionOptionJoiSchema);
    const user = await context.session.getUser(context, instData);
    const property = await context.customProperty.assertGetItemById(
        context,
        data.propertyId,
        throwCustomPropertyNotFoundError
    );

    canReadOrganization(property.organizationId, user);

    if (property.type !== CustomPropertyType.Selection) {
        throw new InvalidRequestError();
    }

    const meta = cast<ISelectionCustomTypeMeta>(property.meta);

    if (meta.type !== SelectionResourceTypes.Custom) {
        throw new InvalidRequestError();
    }

    if (meta.customOptionsProps.areOptionsUnique) {
        const optionExists =
            await context.customSelectionOption.checkItemExistsByName(
                context,
                "name",
                data.data.name
            );

        if (optionExists) {
            throw new CustomSelectionOptionExistsError();
        }
    }

    // TODO: should we check if prev and next IDs exist?

    const newOption: ICustomSelectionOption = {
        customId: getNewId(),
        name: data.data.name,
        description: data.data.description,
        parent: property.parent,
        propertyId: property.customId,
        color: data.data.color,
        createdBy: user.customId,
        createdAt: getDate(),
        prevOptionId: data.data.prevOptionId,
        nextOptionId: data.data.nextOptionId,
        organizationId: property.organizationId,
    };

    const savedOption = await context.customSelectionOption.saveItem(
        context,
        newOption
    );

    return {
        option: getPublicCustomSelectionOption(savedOption),
    };
};

export default createCustomSelectionOption;
