import RequestData from "../../RequestData";
import InternalAddBlockContext from "../internalAddBlock/context";
import internalAddBlock from "../internalAddBlock/internalAddBlock";
import {
    IInternalAddBlockContext,
    IInternalAddBlockParameters,
} from "../internalAddBlock/types";
import { ICreateRootBlockContext } from "./types";

export default class CreateRootBlockContext
    extends InternalAddBlockContext
    implements ICreateRootBlockContext {
    public async addBlock(
        context: IInternalAddBlockContext,
        instData: RequestData<IInternalAddBlockParameters>
    ) {
        const result = await internalAddBlock(context, instData);
        return result;
    }
}
