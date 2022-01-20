import { wrapEndpointREST } from "../utils";
import { Express } from "express";
import { IBaseContext } from "../contexts/IBaseContext";
import createTask from "./createTask/handler";
import deleteTask from "./deleteTask/handler";
import getBoardTasks from "./getBoardTasks/handler";
import transferTask from "./transferTask/handler";
import updateTask from "./updateTask/handler";

const baseURL = "/api/tasks";

export default function setupBoardsRESTEndpoints(
    ctx: IBaseContext,
    app: Express
) {
    const endpoints = {
        createTask: wrapEndpointREST(createTask, ctx),
        deleteTask: wrapEndpointREST(deleteTask, ctx),
        getBoardTasks: wrapEndpointREST(getBoardTasks, ctx),
        transferTask: wrapEndpointREST(transferTask, ctx),
        updateTask: wrapEndpointREST(updateTask, ctx),
    };

    app.post(`${baseURL}/createTask`, endpoints.createTask);
    app.post(`${baseURL}/deleteTask`, endpoints.deleteTask);
    app.post(`${baseURL}/getBoardTasks`, endpoints.getBoardTasks);
    app.post(`${baseURL}/transferTask`, endpoints.transferTask);
    app.post(`${baseURL}/updateTask`, endpoints.updateTask);
}
