# Socket Implementation Tasks

-   Define outgoing events function

    -   Add an outgoing event type which serves as the singular event type for socket broadcasts.

    ```typescript
    // src\endpoints\socket\outgoingEventTypes.ts
    export enum OutgoingSocketEvents {
        ResourceUpdate = "ResourceUpdate",
    }
    ```

    -   Define an outgoing broadcast packet data type.

    ```typescript
    export interface IOutgoingBroadcastPacket<T = any> {
        actionType: SystemActionType;
        resourceType: SystemResourceType;
        resource: T;
    }
    ```

    -   Singular function that takes the information about the room and resource and broadcasts the event.

    ```typescript
    // src\endpoints\socket\outgoing\outgoingEventFn.ts
    function outgoingEventFn(
        ctx: IBaseContext,
        roomName: string,
        actionType: SystemActionType,
        resourceType: SystemResourceType,
        resource: any
    ) {
        const packet: IOutgoingBroadcastPacket = {
            actionType,
            resourceType,
            resource,
        };

        ctx.socketRooms.broadcastToRoom(
            ctx,
            roomName,
            OutgoingSocketEvents.ResourceUpdate,
            packet,

            // No need to skip socket ID, client-side will make sure
            // not to duplicate resources.
            /* skipSocketId= */ undefined
        );
    }
    ```

-   Call outgoing event functions
