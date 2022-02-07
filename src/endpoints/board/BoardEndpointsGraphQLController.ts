import makeSingletonFn from "../../utilities/createSingletonFunc";
import { wrapEndpointREST } from "../wrapEndpointREST";
import createBoard from "./createBoard/handler";
import boardExists from "./boardExists/handler";
import deleteBoard from "./deleteBoard/handler";
import updateBoard from "./updateBoard/handler";
import getOrganizationBoards from "./getOrganizationBoards/handler";
import { makeUpdateBoardContext } from "./updateBoard/context";
import { getBaseContext } from "../contexts/BaseContext";
import getBoard from "./getBoard/handler";

export default class BoardEndpointsGraphQLController {
    public createBoard = wrapEndpointREST(createBoard);
    public boardExists = wrapEndpointREST(boardExists);
    public deleteBoard = wrapEndpointREST(deleteBoard);
    public getOrganizationBoards = wrapEndpointREST(getOrganizationBoards);
    public updateBoard = wrapEndpointREST(
        updateBoard,
        makeUpdateBoardContext(getBaseContext())
    );
    public getBoard = wrapEndpointREST(getBoard);
}

export const getBoardEndpointsGraphQLController = makeSingletonFn(
    () => new BoardEndpointsGraphQLController()
);
