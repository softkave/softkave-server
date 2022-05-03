import { IChat } from "../../mongo/chat";
import { IRoom } from "../../mongo/room";
import { ConvertDatesToStrings } from "../../utilities/types";

export type IPublicRoomData = ConvertDatesToStrings<IRoom>;
export type IPublicChatData = ConvertDatesToStrings<IChat> & {
  localId?: string;
};
