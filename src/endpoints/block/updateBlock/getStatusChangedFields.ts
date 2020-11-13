import { IBlockStatus } from "../../../mongo/block";

function getStatusChangedFields(
    s1: IBlockStatus,
    s2: IBlockStatus
): Array<keyof IBlockStatus> {
    return ["color", "description", "name"].reduce((accumulator, field) => {
        if (s1[field] !== s2[field]) {
            accumulator.push(field);
        }

        return accumulator;
    }, []);
}

export default getStatusChangedFields;
