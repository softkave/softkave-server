import BaseContext, { IBaseContext } from "../../contexts/BaseContext";
import RequestData from "../../RequestData";
import internalAddBlock from "../internalAddBlock/internalAddBlock";
import { IInternalAddBlockParameters } from "../internalAddBlock/types";
import { ICreateRootBlockContext } from "./types";

export default class CreateRootBlockContext
    extends BaseContext
    implements ICreateRootBlockContext {
    public async addBlock(
        context: IBaseContext,
        instData: RequestData<IInternalAddBlockParameters>
    ) {
        const result = await internalAddBlock(context, instData);
        return result;
    }
}
