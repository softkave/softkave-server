import { IBlockStatus } from "../../../mongo/block";

function getStatusChangedFields(
  old: IBlockStatus,
  nw: IBlockStatus
): Array<keyof IBlockStatus> {
  return ["color", "description", "name"].reduce((accumulator, field) => {
    if (old[field] !== nw[field]) {
      accumulator.push(field);
    }

    return accumulator;
  }, []);
}

export default getStatusChangedFields;
