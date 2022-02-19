export enum IncomingSocketEvents {
    Subscribe = "subscribe",
    Unsubscribe = "unsubscribe",
    Auth = "auth",
    FetchMissingBroadcasts = "fetchMissingBroadcasts",
    SendMessage = "sendMessage",
    GetUserRoomsAndChats = "getUserRoomsAndChats",
    UpdateRoomReadCounter = "updateRoomReadCounter",
    Connection = "connection",
    Disconnect = "disconnect",
    UpdateSocketEntry = "updateSocketEntry",
}
