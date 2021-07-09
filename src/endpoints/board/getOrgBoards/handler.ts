import { BlockType } from "../../../mongo/block";
import { validate } from "../../../utilities/joiUtils";
import canReadOrg from "../../org/canReadBlock";
import { IOrganization } from "../../org/types";
import { throwOrgNotFoundError } from "../../org/utils";
import { IBoard } from "../types";
import { getPublicBoardsArray } from "../utils";
import { GetOrgBoardsEndpoint } from "./types";
import { getOrgBoardsJoiSchema } from "./validation";

const getOrgBoards: GetOrgBoardsEndpoint = async (context, instData) => {
    const data = validate(instData.data, getOrgBoardsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const org = await context.block.assertGetBlockById<IOrganization>(
        context,
        data.orgId,
        throwOrgNotFoundError
    );

    canReadOrg(org.customId, user);

    const boards = await context.block.getBlockChildren<IBoard>(
        context,
        data.orgId,
        [BlockType.Board]
    );

    return {
        boards: getPublicBoardsArray(boards),
    };
};

export default getOrgBoards;
