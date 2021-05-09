import moment from "moment";
import { IChat } from "../mongo/chat";
import { IRoom } from "../mongo/room";
import { IUser } from "../mongo/user";
import {
    getEndGreeting,
    getFooterHTML,
    getHeaderHTML,
    getHeaderText,
    getTemplateStylesHTML,
} from "./helpers";

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
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title>${getHeaderText(unseenChatsEmailTitle)}</title>
        <style>
            ${getTemplateStylesHTML()}

            /* chat */
            .chat-message {
                margin-bottom: 8px;
            }

            .chat-date {
                color: #62738d;
            }

            .chat {
                margin: 16px 0px;
            }

            /* room */
            .room-inner {
                display: flex;
            }

            .room-avatar {
                width: 24px;
                height: 24px;
                text-align: center;
                display: inline-block;
                border-radius: 4px;
            }

            .room-content {
                display: flex;
                flex: 1;
                margin-left: 16px;
                flex-direction: column;
            }

            .room {
                margin: 16px 0px;
            }
        </style>
    </head>
    <body>
        ${getHeaderHTML(unseenChatsEmailTitle)}
        ${props.rooms.map(({ room, user, chats }, i) => {
            return `
                <div class="room">
                    ${i > 0 ? "<hr />" : ""}
                    <div class="room-inner">
                        <span class="room-avatar" style="background-color" ${
                            user.color
                        };" />
                        <div class="room-content">
                            <h5>${user.name}</h5>
                            ${chats.map((chat) => {
                                return `
                                    <div class="chat">
                                        <p class="chat-message">${
                                            chat.message
                                        }</p>
                                        <p class="chat-date">${moment(
                                            chat.createdAt
                                        ).format("h:mm A, ddd MMM D YYYY")}</p>
                                    </div>
                                `;
                            })}
                        </div>
                    <div>
                </div>
            `;
        })}
        ${getFooterHTML()}
    </body>
    </html>
  `;
}

export function generateUnseenChatsText(props: IGenerateUnseenChatsEmailProps) {
    const txt = `
    ${getHeaderText(unseenChatsEmailTitle)}

    ${props.rooms.map(({ room, user, chats }) => {
        return `
                => ${user.name}
                ${chats.map((chat) => {
                    return `
                    ${chat.message}
                    ${moment(chat.createdAt).format("h:mm A, ddd MMM D YYYY")}

                    `;
                })}


        `;
    })}

    ${getEndGreeting()}
    `;

    return txt;
}
