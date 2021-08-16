import { ICustomPropertyValue } from "../../../mongo/custom-property/definitions";
import { InvalidInputError, ServerError } from "../../../utilities/errors";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import { getPublicCustomPropertyValueData } from "../utils";
import { UpdateValueEndpoint } from "./types";
import { updateValueEndpointJoiSchema } from "./validation";

const updateValue: UpdateValueEndpoint = async (context, instData) => {
    const data = validate(instData.data, updateValueEndpointJoiSchema);
    const user = await context.session.getUser(context, instData);
    const [property, value] = await Promise.all([
        context.customProperty.assertGetCustomPropertyById(
            context,
            data.propertyId
        ),
        context.customPropertyValue.getOneValueByParent(
            context,
            data.parent,
            data.propertyId
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
        savedValue =
            await context.customPropertyValue.updateCustomPropertyValueById(
                context,
                value.customId,
                {
                    ...data.data,
                    updatedAt: getDate(),
                    updatedBy: user.customId,
                }
            );
    } else {
        savedValue = await context.customPropertyValue.saveCustomPropertyValue(
            context,
            {
                ...data.data,
                createdAt: getDate(),
                createdBy: user.customId,
                customId: getNewId(),
                organizationId: property.organizationId,
                parent: data.parent,
                propertyId: property.customId,
                type: property.type,
            }
        );
    }

    if (!savedValue) {
        // Log error
        throw new ServerError();
    }

    return {
        value: getPublicCustomPropertyValueData(savedValue),
    };
};

export default updateValue;
