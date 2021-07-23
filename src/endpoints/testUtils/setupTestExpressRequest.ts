import moment from "moment";
import { IToken } from "../../mongo/token";
import cast from "../../utilities/fns";
import { clientConstants } from "../client/constants";
import { IServerRequest } from "../contexts/types";

export interface ISetupTestExpressRequestWithTokenParams {
    token: IToken;
}

export interface ISetupTestExpressRequestWithTokenResult {
    req: IServerRequest;
}

export function setupTestExpressRequestWithToken(
    props: ISetupTestExpressRequestWithTokenParams
): ISetupTestExpressRequestWithTokenResult {
    const req = cast<IServerRequest>({
        ip: "test::ip",
        ips: ["test::ip"],
        headers: {
            "user-agent": "test-bot",
            [clientConstants.clientIdHeaderKey]: props.token.clientId,
        },
        user: {
            version: props.token.version,
            sub: {
                id: props.token.customId,
            },
            iat: moment(props.token.issuedAt).valueOf() / 1000,
        },
    });

    return { req };
}

export interface ISetupTestExpressRequestResult {
    req: IServerRequest;
}

export function setupTestExpressRequest(): ISetupTestExpressRequestResult {
    const req = cast<IServerRequest>({
        ip: "test::ip",
        ips: ["test::ip"],
        headers: {
            "user-agent": "test-bot",
        },
    });

    return { req };
}
