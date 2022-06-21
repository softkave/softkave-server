import { ICollaborationRequest } from "../../mongo/collaboration-request";
import { ConvertDatesToStrings } from "../../utilities/types";

export type IPublicCollaborationRequest =
    ConvertDatesToStrings<ICollaborationRequest>;
