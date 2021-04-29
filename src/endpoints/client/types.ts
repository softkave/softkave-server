import { IClient } from "../../mongo/client";
import { ConvertDatesToStrings } from "../../utilities/types";

export type IPublicClient = ConvertDatesToStrings<IClient>;
