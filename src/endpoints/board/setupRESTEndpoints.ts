import { wrapEndpointREST } from "../utils";
import { Express } from "express";
import { IBaseContext } from "../contexts/IBaseContext";
import boardExists from "./boardExists/handler";
import createBoard from "./createBoard/handler";
import deleteBoard from "./deleteBoard/handler";
import getOrganizationBoards from "./getOrganizationBoards/handler";
import updateBoard from "./updateBoard/handler";
import getBoard from "./getBoard/handler";
import { makeUpdateBoardContext } from "./updateBoard/context";

const baseURL = "/api/boards";

export default function setupBoardsRESTEndpoints(
    ctx: IBaseContext,
    app: Express
) {
    const endpoints = {
        boardExists: wrapEndpointREST(boardExists, ctx),
        createBoard: wrapEndpointREST(createBoard, ctx),
        deleteBoard: wrapEndpointREST(deleteBoard, ctx),
        getOrganizationBoards: wrapEndpointREST(getOrganizationBoards, ctx),
        updateBoard: wrapEndpointREST(updateBoard, makeUpdateBoardContext(ctx)),
        getBoard: wrapEndpointREST(getBoard, ctx),
    };

    app.post(`${baseURL}/boardExists`, endpoints.boardExists);
    app.post(`${baseURL}/createBoard`, endpoints.createBoard);
    app.post(`${baseURL}/deleteBoard`, endpoints.deleteBoard);
    app.post(
        `${baseURL}/getOrganizationBoards`,
        endpoints.getOrganizationBoards
    );
    app.post(`${baseURL}/updateBoard`, endpoints.updateBoard);
    app.post(`${baseURL}/getBoard`, endpoints.getBoard);
}
