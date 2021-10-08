import { BlockType } from "../../../mongo/block";
import {
    CustomPropertyType,
    ICustomProperty,
    ISelectionCustomTypeMeta,
} from "../../../mongo/custom-property/definitions";
import { InvalidInputError } from "../../../utilities/errors";
import cast, { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import ReusableDataQueries from "../../ReuseableDataQueries";
import { CustomPropertyExistsError } from "../errors";
import ToPublicCustomData from "../utils";
import { CreatePropertyEndpoint } from "./types";
import { createPropertyJoiSchema } from "./validation";

const createProperty: CreatePropertyEndpoint = async (context, instData) => {
    const data = validate(instData.data, createPropertyJoiSchema);
    const user = await context.session.getUser(context, instData);
    const parent = await context.block.assertGetBlockById(
        context,
        data.parent.customId
    );

    if (parent.type !== cast<BlockType>(data.parent.type)) {
        throw new InvalidInputError();
    }

    canReadOrganization(parent.rootBlockId || parent.customId, user);
    const propertyExists = await context.data.customProperty.checkItemExists(
        ReusableDataQueries.byName(data.property.name)
    );

    if (propertyExists) {
        throw new CustomPropertyExistsError();
    }

    if (data.property.type === CustomPropertyType.Selection) {
        const meta = cast<ISelectionCustomTypeMeta>(data.property.meta);

        if (meta.selectFrom) {
            await context.block.assertBlockById(
                context,
                meta.selectFrom.customId
            );
        }
    }

    const property: ICustomProperty = {
        customId: getNewId(),
        name: data.property.name,
        description: data.property.description,
        parent: data.parent,
        type: data.property.type,
        isRequired: data.property.isRequired,
        meta: data.property.meta,
        createdBy: user.customId,
        createdAt: getDate(),
        organizationId: parent.rootBlockId || parent.customId,
    };

    const savedProperty = await context.data.customProperty.saveItem(property);

    return {
        property: ToPublicCustomData.customProperty(savedProperty),
    };
};

export default createProperty;
