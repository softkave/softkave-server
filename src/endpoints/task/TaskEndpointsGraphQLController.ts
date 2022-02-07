import makeSingletonFn from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import { wrapEndpointREST } from "../wrapEndpointREST";
import createTask from "./createTask/handler";
import deleteTask from "./deleteTask/handler";
import getBoardTasks from "./getBoardTasks/handler";
import transferTask from "./transferTask/handler";
import { makeUpdateTaskContext } from "./updateTask/context";
import updateTask from "./updateTask/handler";

export default class TaskEndpointsGraphQLController {
    public createTask = wrapEndpointREST(createTask);
    public deleteTask = wrapEndpointREST(deleteTask);
    public getBoardTasks = wrapEndpointREST(getBoardTasks);
    public transferTask = wrapEndpointREST(transferTask);
    public updateTask = wrapEndpointREST(
        updateTask,
        makeUpdateTaskContext(getBaseContext())
    );
}

export const getTaskEndpointsGraphQLController = makeSingletonFn(
    () => new TaskEndpointsGraphQLController()
);
