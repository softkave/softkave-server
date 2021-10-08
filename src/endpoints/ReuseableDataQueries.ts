import {
    IPersistedResource,
    IPersistedResourceWithName,
} from "../mongo/definitions";
import {
    DataProviderFilterValueOperator,
    IDataProviderFilter,
} from "./contexts/DataProvider";

function byId(id: string): IDataProviderFilter<IPersistedResource> {
    return {
        items: [
            {
                customId: {
                    value: id,
                    queryOp: DataProviderFilterValueOperator.Equal,
                },
            },
        ],
    };
}

function byName(name: string): IDataProviderFilter<IPersistedResourceWithName> {
    return {
        items: [
            {
                name: {
                    value: name,
                    queryOp: DataProviderFilterValueOperator.Regex,
                },
            },
        ],
    };
}

export default class ReusableDataQueries {
    public static byId = byId;
    public static byName = byName;
}
