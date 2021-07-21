import { BlockType } from "../../../mongo/block";
import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organization/canReadBlock";
import { IOrganization } from "../../organization/types";
import { throwOrganizationNotFoundError } from "../../organization/utils";
import { IBoard } from "../types";
import { getPublicBoardsArray } from "../utils";
import { GetOrganizationBoardsEndpoint } from "./types";
import { getOrganizationBoardsJoiSchema } from "./validation";

const getOrganizationBoards: GetOrganizationBoardsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, getOrganizationBoardsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const organization = await context.block.assertGetBlockById<IOrganization>(
        context,
        data.organizationId,
        throwOrganizationNotFoundError
    );

    canReadOrganization(organization.customId, user);

    const boards = await context.block.getBlockChildren<IBoard>(
        context,
        data.organizationId,
        [BlockType.Board]
    );

    return {
        boards: getPublicBoardsArray(boards),
    };
};

export default getOrganizationBoards;
