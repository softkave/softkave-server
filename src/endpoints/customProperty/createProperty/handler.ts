import { BlockType } from "../../../mongo/block";
import { ICustomProperty } from "../../../mongo/custom-property/definitions";
import cast, { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { InvalidRequestError } from "../../errors";
import canReadOrganization from "../../organization/canReadBlock";
import { CustomPropertyExistsError } from "../errors";
import { getPublicCustomProperty } from "../utils";
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
        throw new InvalidRequestError();
    }

    canReadOrganization(parent.rootBlockId || parent.customId, user);
    const propertyExists = await context.customProperty.checkItemExistsByName(
        context,
        "name",
        data.property.name
    );

    if (propertyExists) {
        throw new CustomPropertyExistsError();
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

    const savedProperty = await context.customProperty.saveItem(
        context,
        property
    );
    return {
        property: getPublicCustomProperty(savedProperty),
    };
};

export default createProperty;
