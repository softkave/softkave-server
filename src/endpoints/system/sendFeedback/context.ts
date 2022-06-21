import makeSingletonFn from "../../../utilities/createSingletonFunc";
import BaseContext from "../../contexts/BaseContext";
import createTask from "../../tasks/createTask/handler";
import { ISendFeedbackContext } from "./types";

export default class SendFeedbackContext
  extends BaseContext
  implements ISendFeedbackContext
{
  public saveTask = createTask;
}

export const getSendFeedbackContext = makeSingletonFn(
  () => new SendFeedbackContext()
);
