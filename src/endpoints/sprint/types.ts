import { ISprint } from "../../mongo/sprint";
import { ConvertDatesToStrings } from "../../utilities/types";

export type IPublicSprint = ConvertDatesToStrings<ISprint>;
