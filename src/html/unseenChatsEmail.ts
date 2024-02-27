import {notImplementFn} from '../endpoints/testUtils/utils';
import {IChat} from '../mongo/chat/definitions';
import {IChatRoom} from '../mongo/room/definitions';
import {IUser} from '../mongo/user/definitions';

export const unseenChatsEmailTitle = 'Unseen Chats';

export interface IGenerateUnseenChatsEmailProps {
  rooms: Array<{
    room: IChatRoom;
    user: IUser;
    chats: IChat[];
  }>;
}

export function generateUnseenChatsEmailHTML(props: IGenerateUnseenChatsEmailProps) {
  notImplementFn();
}

export function generateUnseenChatsText(props: IGenerateUnseenChatsEmailProps) {
  notImplementFn();
}
