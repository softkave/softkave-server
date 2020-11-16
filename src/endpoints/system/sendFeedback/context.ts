import internalAddBlock from "../../block/internalAddBlock/internalAddBlock";
import BaseContext from "../../contexts/BaseContext";
import { ISendFeedbackContext } from "./types";

export default class SendFeedbackContext
    extends BaseContext
    implements ISendFeedbackContext {
    public async saveTask(context, instData) {
        return await internalAddBlock(context, instData);
    }
}
