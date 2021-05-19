import { Socket } from "socket.io";
import cast from "../../utilities/fns";
import { IBaseTokenData } from "../contexts/TokenContext";
import { IServerRequest } from "../contexts/types";

export const notImplementFn = (() => {
    throw new Error("Not implemented");
}) as any;

export const testNoop = (() => {}) as any;

export async function getTestExpressRequest(params: {
    incomingTokenData: IBaseTokenData;
    clientId: string;
}) {
    const partialRequest: Partial<IServerRequest> = {
        user: params.incomingTokenData,
        headers: {
            ["user-agent"]: "test",
            ["x-client-id"]: params.clientId,
        },
    };

    return cast<IServerRequest>(partialRequest);
}

export function getTestSocket(params: { id: string }) {
    const partialSocket: Partial<Socket> = {
        id: params.id,
    };

    return cast<Socket>(partialSocket);
}
