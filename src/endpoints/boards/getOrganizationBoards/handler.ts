import { BlockType } from "../../../mongo/block";
import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organizations/canReadBlock";
import { IOrganization } from "../../organizations/types";
import { throwOrganizationNotFoundError } from "../../organizations/utils";
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
