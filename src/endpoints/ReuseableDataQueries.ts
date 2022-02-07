import {
    IPersistedResource,
    IPersistedResourceWithName,
} from "../mongo/definitions";
import {
    DataProviderFilterValueOperator,
    IDataProviderFilter,
} from "./contexts/data-providers/DataProvider";

function byId(id: string): IDataProviderFilter<IPersistedResource> {
    return {
        items: {
            customId: {
                value: id,
                queryOp: DataProviderFilterValueOperator.Equal,
            },
        },
    };
}

function byIds(ids: string[]): IDataProviderFilter<IPersistedResource> {
    return {
        items: {
            customId: {
                value: ids,
                queryOp: DataProviderFilterValueOperator.In,
            },
        },
    };
}

function byName(name: string): IDataProviderFilter<IPersistedResourceWithName> {
    return {
        items: {
            name: {
                value: name,
                queryOp: DataProviderFilterValueOperator.Regex,
            },
        },
    };
}

export default class ReusableDataQueries {
    public static byId = byId;
    public static byName = byName;
}
