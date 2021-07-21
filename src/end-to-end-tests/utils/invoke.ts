import { OutgoingHttpHeaders } from "http";
import get from "lodash/get";
import { getServerAddr } from "./addr";

const assert = require("assert").strict;

export interface IAppError extends Error {
    field?: string;
    action?: string;
}

export interface IInvokeGraphQLParams {
    query: string;
    variables: any;
    paths: string[];
    token?: string;
    clientId?: string;
    headers?: OutgoingHttpHeaders;
}

export interface IInvokeGraphQLResult {
    errors?: IAppError[];
    result?: any;
    data: { [key: string]: any };
}

export async function invokeGraphQL(
    props: IInvokeGraphQLParams
): Promise<IInvokeGraphQLResult> {
    const { query, variables, paths, clientId, token } = props;
    const headers = {
        "Content-Type": "application/json",
        ...(props.headers || {}),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    if (clientId) {
        headers["x-client-id"] = clientId;
    }

    const result = await fetch(getServerAddr(), {
        headers,
        body: JSON.stringify({
            query,
            variables,
        }),
        method: "POST",
        mode: "cors",
    });

    assert(result.headers.get("Content-Type") === "application/json");

    const body = await result.json();
    const data: any = {};
    let errors: any;

    if (body) {
        paths.forEach((path) => {
            const dataInPath = get(body, `data.${path}`);

            if (dataInPath && dataInPath.errors) {
                errors = (errors || []).concat(dataInPath.errors);
            }

            data[path] = dataInPath;
        });
    }

    if (result.ok) {
        return { errors, data, result: body };
    }

    throw new Error(result.statusText);
}
