import { blockTaskCollaboratorsDataSchema } from "../../mongo/block";
import blockSchema from "../../mongo/block/definitions";
import extractFieldNames from "../../utils/extractFieldNames";

export const blockTaskCollaboratorFieldNames = extractFieldNames(
  blockTaskCollaboratorsDataSchema
);

const blockFieldNames = extractFieldNames(blockSchema);

export default blockFieldNames;
