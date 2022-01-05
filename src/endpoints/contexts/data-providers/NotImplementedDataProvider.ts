import { methodNotImplemented } from "../../../utilities/fns";
import { IDataProvider } from "./DataProvider";

export default class NotImplementedDataProvider<T extends object>
    implements IDataProvider<T>
{
    checkItemExists = methodNotImplemented;
    getItem = methodNotImplemented;
    getManyItems = methodNotImplemented;
    deleteItem = methodNotImplemented;
    deleteManyItems = methodNotImplemented;
    updateItem = methodNotImplemented;
    assertItemExists = methodNotImplemented;
    assertGetItem = methodNotImplemented;
    assertUpdateItem = methodNotImplemented;
    saveItem = methodNotImplemented;
    bulkSaveItems = methodNotImplemented;
    bulkDeleteItems = methodNotImplemented;
    bulkUpdateItems = methodNotImplemented;
    updateManyItems = methodNotImplemented;
}
