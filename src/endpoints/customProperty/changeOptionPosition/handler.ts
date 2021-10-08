import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { IBaseContext } from "../../contexts/BaseContext";
import canReadOrganization from "../../organization/canReadBlock";
import ReusableDataQueries from "../../ReuseableDataQueries";
import ToPublicCustomData from "../utils";
import { ChangeOptionPositionEndpoint } from "./types";
import { changeOptionPositionJoiSchema } from "./validation";

async function connectOptions(
    context: IBaseContext,
    leftOptionId?: string,
    rightOptionId?: string
) {
    if (leftOptionId && !rightOptionId) {
        await context.data.customOption.updateItem(
            ReusableDataQueries.byId(leftOptionId),
            { nextOptionId: null }
        );
    } else if (rightOptionId && !leftOptionId) {
        await context.data.customOption.updateItem(
            ReusableDataQueries.byId(leftOptionId),
            { prevOptionId: null }
        );
    } else if (rightOptionId && leftOptionId) {
        await context.data.customOption.updateItem(
            ReusableDataQueries.byId(leftOptionId),
            { nextOptionId: rightOptionId }
        );
        await context.data.customOption.updateItem(
            ReusableDataQueries.byId(rightOptionId),
            { prevOptionId: leftOptionId }
        );
    }
}

const changeOptionPosition: ChangeOptionPositionEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, changeOptionPositionJoiSchema);
    const user = await context.session.getUser(context, instData);
    const option = await context.data.customOption.assertGetItem(
        ReusableDataQueries.byId(data.customId)
    );

    canReadOrganization(option.organizationId, user);

    if (option.prevOptionId === data.prevOptionId) {
        return {
            option: ToPublicCustomData.customOption(option),
        };
    }

    const newPrevOption =
        data?.prevOptionId &&
        (await context.data.customOption.assertGetItem(
            ReusableDataQueries.byId(data.prevOptionId)
        ));

    connectOptions(context, option.prevOptionId, option.nextOptionId);
    connectOptions(context, newPrevOption.customId, option.customId);
    connectOptions(context, option.customId, newPrevOption.nextOptionId);

    const updatedOption = await context.data.customOption.updateItem(
        ReusableDataQueries.byId(option.customId),
        { updatedAt: getDate(), updatedBy: user.customId }
    );

    return {
        option: ToPublicCustomData.customOption(updatedOption),
    };
};

export default changeOptionPosition;
