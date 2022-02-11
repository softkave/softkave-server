# Socket Architecture

## Socket connection control flow

-   On connection, authenticate the user
-   Add the socket to a key-value map of sockets
-   Add the user to relevant rooms, like the client room (where the socket will be the only member) and the user's room

In this arcitecture, we will be moving to a rooms-based model, meaning all communication will be published to rooms only. The primary space impacted is sending events directly to sockets outside of rooms. So, if we want to publish an event to a client, we will publish to the room, then all sockets (one in this case) attached to the room will receive the message.

## Data structures

```typescript
interface ISocketDetails {
    socket: Socket;
    clientId: string;
    userId: string;

    // whether the user is currently on the app or not.
    // this is currently getting tracked in db, we want to
    // move this to this object and possibly reduce the stress
    // on the db.
    isActive?: boolean;
}

interface ISocketContext {
    sockets: Record<string, ISocketDetails>;

    // gets a socket by id. if the socket is disconnected
    // or does not exist, it return null.
    getSocket: (id: string) => ISocketDetails | null;
    removeSocket: (id: string) => void;

    // inserts a socket using the id. If the socket exists,
    // merge the data.
    addSocket: (socketDetails: ISocketDetails) => null;
}

interface ISocketRoom {
    name: string;
    socketIds: string[];
    lastBroadcastTimestamp: number;

    // for rooms where we don't want to have a separate subscribed
    // sockets list if another room would have an identical list.
    // e.g board and board--tasks.
    includeSocketIdsInRoom?: string;
}

interface IRoomCreationOptions {
    includeSocketIdsInRoom?: string;
}

interface IRoomContext {
    addToRoom: (
        roomName: string,
        socketId: string,
        roomCreationOptions?: IRoomCreationOptions
    ) => void;
    removeFromRoom: (roomName: string, socketId: string) => void;
    broadcastToRoom: (roomName: string, event: string, data: any) => void;
    getRoom: (roomName: string) => ISocketRoom | null;
}

interface ISocketRoomNameHelpers {
    getUserRoomName: (resourceId: string) => string;
    getClientRoomName: (resourceId: string) => string;
    getClientRoomName: (resourceId: string) => string;
    getClientRoomName: (resourceId: string) => string;
}

// we will only have one incoming event type.
// the data passed will contain the endpoint name and params.
const incomingEndpointEventName = "endpoint";

// we will also have a single outgoing event type.
// context data will be passed in the data broadcasted to
// listening sockets.
const outgoingBroadcastEventName = "broadcast";

interface IIncomingEndpointEventParams {
    endpointName: string;
    endpointArgs: any;
}

interface IOutgoingBroadcastEventPackage {
    // for routing on the frontend.
    destination: string;
    data: any;
}

// socket endpoints
interface ISocketRoomState {
    lastBroadcastTimestamp: number;
}

const addToRoom = (params: { roomName: string }) => void;
const removeFromRoom = (params: { roomName: string }) => void;
const getRoomState = (params: { roomName: string }) => Promise<{ lastBroadcastTimestamp: number; } |  null>;
const updateClient = (params: { isActive: boolean; }) => void;
```

## Frontend behavior

-   When a socket disconnects or after the client subscribes to a room, we should fetch the room state.
-   If it exists:
    -   If the room tracks a resource, like a board, compare the lastBroadcastTimestamp and the resource's updatedAt field and if they're different, fetch the resource in the background and show a error if an error occurs.
    -   If the room does not track a resource, but a resource's children, like a board's tasks, use the lastBroadcastTimestamp to fetch resources whose updatedAt field is after the lastBroadcastTimestamp of the room. Remove resources that have been deleted also from the store. We'll add a new endpoint for getting a list of tasks or sprints, and other children types by ID and last updated time.
    -   As a special case, if the room tracks a chat room, fetch the messages sent after the lastBroadcastTimestamp. We'll also need a new endpoint for that.

## Room strategy and Backend behaviour

-   Each user will have a room with format "user-${userId}". The room will be generated the first time the user logs in.
-   Each client will have a room with format "client-${clientId}". The room will be generated when the socket is authenticated. It will be deleted on disconnect.
-   Each organization will have a room with format "org-${organizationId}". The room will be created on the first call to subscribe to the room.
-   Each board will have a room with format "board-${boardId}". The room will be created on the first call to subscribe to the room.
    -   A separate room will be created for tracking board tasks and board sprints. They will be generated with the board ID, with "sprints" or "tasks" appended.
-   Chat rooms will have a room with format "chat-${member[0].id}-${member[1].id}". Chat rooms currently only have two recipients. Will be created the first time a message is sent to the room.

All rooms will be deleted once there aren't any sockets listening to them. Sockets that can't be found in the connected sockets map when broadcasting will be removed from the room. Sockets will be removed from the connected sockets map when they disconnect, or they get unauthenticated, e.g when the user changes their password.

Events should be declared in one place for structure and reuse. We will have the following events:

-   user
    -   update-user
-   organization
    -   create-organization
    -   update-organization
    -   delete-organization
-   board
    -   create-board
    -   update-board
    -   delete-board
-   task
    -   create-task
    -   update-task
    -   delete-task
-   sprint
    -   create-sprint
    -   update-sprint
    -   delete-sprint
-   chat
    -   new-message

Diffs of updates will be broadcasted instead of the data, with the update timestamp.
