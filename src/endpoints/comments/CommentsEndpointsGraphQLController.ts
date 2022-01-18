import { wrapEndpointREST } from "../wrapEndpointREST";
import addComment from "./addComment/addComment";
import getComments from "./getComments/getComments";

export default class CommentsEndpointsGraphQLController {
    public addComment = wrapEndpointREST(addComment);
    public getComments = wrapEndpointREST(getComments);
}

const controller: CommentsEndpointsGraphQLController =
    new CommentsEndpointsGraphQLController();

export function getCommentsEndpointsGraphQLController() {
    return controller;
}
