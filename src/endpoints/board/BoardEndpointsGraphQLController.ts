import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import createBoard from "./createBoard/handler";
import boardExists from "./boardExists/handler";
import deleteBoard from "./deleteBoard/handler";
import UpdateBoardContext from "./updateBoard/context";
import updateBoard from "./updateBoard/handler";
import getOrganizationBoards from "./getOrgBoards/handler";

export default class BoardEndpointsGraphQLController {
    public createBoard(data, req) {
        return wrapEndpoint(data, req, async () =>
            // @ts-ignore
            createBoard(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public boardExists(data, req) {
        return wrapEndpoint(data, req, async () =>
            boardExists(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public deleteBoard(data, req) {
        return wrapEndpoint(data, req, async () =>
            deleteBoard(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getOrganizationBoards(data, req) {
        return wrapEndpoint(data, req, async () =>
            getOrganizationBoards(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public updateBoard(data, req) {
        return wrapEndpoint(data, req, async () =>
            updateBoard(
                new UpdateBoardContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }
}

export const getBoardEndpointsGraphQLController = makeSingletonFunc(
    () => new BoardEndpointsGraphQLController()
);
