import {IChat} from '../../mongo/chat/definitions';
import {IChatRoom} from '../../mongo/room/definitions';
import {ConvertDatesToStrings} from '../../utilities/types';

export type IPublicChatRoom = ConvertDatesToStrings<IChatRoom>;
export type IPublicChat = ConvertDatesToStrings<IChat> & {
  localId?: string;
};
