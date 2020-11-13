import BaseContext from "../../contexts/BaseContext";
import internalAddBlock from "../internalAddBlock/internalAddBlock";
import { IAddBlockContext } from "./types";

export default class AddBlockContext
    extends BaseContext
    implements IAddBlockContext {
    public async addBlock(context, instData) {
        return await internalAddBlock(context, instData);
    }
}
