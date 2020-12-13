import makeSingletonFunc from "../../../utilities/createSingletonFunc";
import InternalAddBlockContext from "../../block/internalAddBlock/context";
import internalAddBlock from "../../block/internalAddBlock/internalAddBlock";
import { ISendFeedbackContext } from "./types";

export default class SendFeedbackContext
    extends InternalAddBlockContext
    implements ISendFeedbackContext {
    public async saveTask(context, instData) {
        return await internalAddBlock(context, instData);
    }
}

export const getSendFeedbackContext = makeSingletonFunc(
    () => new SendFeedbackContext()
);
