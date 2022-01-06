import makeSingletonFn from "../../utilities/createSingletonFunc";
import { wrapEndpointREST } from "../utils";
import createBoard from "./createBoard/handler";
import boardExists from "./boardExists/handler";
import deleteBoard from "./deleteBoard/handler";
import UpdateBoardContext from "./updateBoard/context";
import updateBoard from "./updateBoard/handler";
import getOrganizationBoards from "./getOrganizationBoards/handler";

export default class BoardEndpointsGraphQLController {
    public createBoard = wrapEndpointREST(createBoard);
    public boardExists = wrapEndpointREST(boardExists);
    public deleteBoard = wrapEndpointREST(deleteBoard);
    public getOrganizationBoards = wrapEndpointREST(getOrganizationBoards);
    public updateBoard = wrapEndpointREST(
        updateBoard,
        new UpdateBoardContext()
    );
}

export const getBoardEndpointsGraphQLController = makeSingletonFn(
    () => new BoardEndpointsGraphQLController()
);
