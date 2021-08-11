import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import { getPublicCustomPropertyArray } from "../utils";
import { GetPropertiesEndpoint } from "./types";
import { getPropertiesJoiSchema } from "./validation";

const getProperties: GetPropertiesEndpoint = async (context, instData) => {
    const data = validate(instData.data, getPropertiesJoiSchema);
    const user = await context.session.getUser(context, instData);
    const parent = await context.block.assertGetBlockById(
        context,
        data.parentId
    );

    canReadOrganization(parent.rootBlockId || parent.customId, user);
    const properties = await context.customProperty.bulkGetItemsByField(
        context,
        "parent.customId",
        data.parentId
    );

    return {
        properties: getPublicCustomPropertyArray(properties),
    };
};

export default getProperties;
