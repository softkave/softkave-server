import { IBoardSprintOptions, ISprint } from "../../mongo/sprint";
import { ConvertDatesToStrings } from "../../utilities/types";

export type IPublicSprint = ConvertDatesToStrings<ISprint>;
export type IPublicSprintOptions = ConvertDatesToStrings<IBoardSprintOptions>;
