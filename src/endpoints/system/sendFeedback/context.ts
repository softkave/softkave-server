import makeSingletonFn from "../../../utilities/createSingletonFunc";
import createTask from "../../task/createTask/handler";
import { ISendFeedbackContext } from "./types";
import BaseContext from "../../contexts/BaseContext";

export default class SendFeedbackContext
    extends BaseContext
    implements ISendFeedbackContext
{
    public saveTask = createTask;
}

export const getSendFeedbackContext = makeSingletonFn(
    () => new SendFeedbackContext()
);
