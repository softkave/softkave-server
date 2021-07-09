import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import createTask from "./createTask/handler";
import deleteTask from "./deleteTask/handler";
import getBoardTasks from "./getBoardTasks/handler";
import transferTask from "./transferTask/handler";
import UpdateTaskContext from "./updateTask/context";
import updateTask from "./updateTask/handler";

export default class TaskEndpointsGraphQLController {
    public createTask(data, req) {
        return wrapEndpoint(data, req, async () =>
            // @ts-ignore
            createTask(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public deleteTask(data, req) {
        return wrapEndpoint(data, req, async () =>
            deleteTask(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getBoardTasks(data, req) {
        return wrapEndpoint(data, req, async () =>
            getBoardTasks(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public transferTask(data, req) {
        return wrapEndpoint(data, req, async () =>
            transferTask(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public updateTask(data, req) {
        return wrapEndpoint(data, req, async () =>
            updateTask(
                new UpdateTaskContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }
}

export const getTaskEndpointsGraphQLController = makeSingletonFunc(
    () => new TaskEndpointsGraphQLController()
);
