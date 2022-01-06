import makeSingletonFn from "../../utilities/createSingletonFunc";
import { wrapEndpointREST } from "../utils";
import createTask from "./createTask/handler";
import deleteTask from "./deleteTask/handler";
import getBoardTasks from "./getBoardTasks/handler";
import transferTask from "./transferTask/handler";
import UpdateTaskContext from "./updateTask/context";
import updateTask from "./updateTask/handler";

export default class TaskEndpointsGraphQLController {
    public createTask = wrapEndpointREST(createTask);
    public deleteTask = wrapEndpointREST(deleteTask);
    public getBoardTasks = wrapEndpointREST(getBoardTasks);
    public transferTask = wrapEndpointREST(transferTask);
    public updateTask = wrapEndpointREST(updateTask, new UpdateTaskContext());
}

export const getTaskEndpointsGraphQLController = makeSingletonFn(
    () => new TaskEndpointsGraphQLController()
);
