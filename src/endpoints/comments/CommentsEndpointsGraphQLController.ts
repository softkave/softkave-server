import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import addComment from "./addComment/addComment";
import getComments from "./getComments/getComments";

export default class CommentsEndpointsGraphQLController {
    public addComment(data, req) {
        return wrapEndpoint(data, req, () =>
            addComment(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public getComments(data, req) {
        return wrapEndpoint(data, req, () =>
            getComments(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }
}

const controller: CommentsEndpointsGraphQLController = new CommentsEndpointsGraphQLController();

export function getCommentsEndpointsGraphQLController() {
    return controller;
}
