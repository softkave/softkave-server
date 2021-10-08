import {
    CustomPropertyType,
    ICustomPropertyValue,
    ISelectionCustomTypeValue,
} from "../../../mongo/custom-property/definitions";
import { InvalidInputError, ServerError } from "../../../utilities/errors";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import ReusableDataQueries from "../../ReuseableDataQueries";
import CustomDataQueries from "../CustomDataQueries";
import ToPublicCustomData from "../utils";
import { UpdateValueEndpoint } from "./types";
import { updateValueEndpointJoiSchema } from "./validation";

const updateValue: UpdateValueEndpoint = async (context, instData) => {
    const data = validate(instData.data, updateValueEndpointJoiSchema);
    const user = await context.session.getUser(context, instData);
    const [property, value] = await Promise.all([
        context.data.customProperty.assertGetItem(
            ReusableDataQueries.byId(data.propertyId)
        ),
        context.data.customValue.assertGetItem(
            CustomDataQueries.byParentAndPropertyId(
                data.parent,
                data.propertyId
            )
        ),
    ]);

    canReadOrganization(property.organizationId, user);

    if (property.type !== data.type) {
        throw new InvalidInputError({
            message: "Provided property type and saved type do not match",
        });
    }

    // TODO: validate property constraints
    // TODO: validate that parents exists in org

    let savedValue: ICustomPropertyValue | null = null;

    if (value) {
        savedValue = await context.data.customValue.assertUpdateItem(
            ReusableDataQueries.byId(value.customId),
            {
                ...data.data,
                updatedAt: getDate(),
                updatedBy: user.customId,
            }
        );
    } else {
        savedValue = await context.data.customValue.saveItem({
            ...data.data,
            createdAt: getDate(),
            createdBy: user.customId,
            customId: getNewId(),
            organizationId: property.organizationId,
            parent: data.parent,
            propertyId: property.customId,
            type: property.type,
        });
    }

    if (!savedValue) {
        // TODO: Log error
        throw new ServerError();
    }

    if (savedValue.type === CustomPropertyType.Selection) {
    }

    return {
        value: ToPublicCustomData.customValue(savedValue),
    };
};

export default updateValue;
