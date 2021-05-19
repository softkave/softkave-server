import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { ICommentContext } from "../contexts/CommentContext";
import { notImplementFn } from "./utils";

class TestCommentContext implements ICommentContext {
    createComment = notImplementFn;
    getComments = notImplementFn;
}

export const getTestCommentContext = makeSingletonFunc(
    () => new TestCommentContext()
);
