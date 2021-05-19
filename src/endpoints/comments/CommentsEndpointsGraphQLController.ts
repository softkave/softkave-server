import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import addComment from "./addComment/addComment";
import getComments from "./getComments/getComments";

export default class CommentsEndpointsGraphQLController {
    public addComment(data, req) {
        return wrapEndpoint(data, req, async () =>
            addComment(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getComments(data, req) {
        return wrapEndpoint(data, req, async () =>
            getComments(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }
}

const controller: CommentsEndpointsGraphQLController =
    new CommentsEndpointsGraphQLController();

export function getCommentsEndpointsGraphQLController() {
    return controller;
}
