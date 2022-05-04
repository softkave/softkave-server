import { notImplementFn } from "../endpoints/testUtils/utils";
import { IChat } from "../mongo/chat";
import { IRoom } from "../mongo/room";
import { IUser } from "../mongo/user";

export const unseenChatsEmailTitle = "Unseen Chats";

export interface IGenerateUnseenChatsEmailProps {
  rooms: Array<{
    room: IRoom;
    user: IUser;
    chats: IChat[];
  }>;
}

export function generateUnseenChatsEmailHTML(
  props: IGenerateUnseenChatsEmailProps
) {
  notImplementFn();
}

export function generateUnseenChatsText(props: IGenerateUnseenChatsEmailProps) {
  notImplementFn();
}
