import makeSingletonFunc from "../../utilities/createSingletonFunc";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import { getSendFeedbackContext } from "./sendFeedback/context";
import sendFeedback from "./sendFeedback/sendFeedback";

export default class SystemEndpointsGraphQLController {
    public sendFeedback(data, req) {
        return wrapEndpoint(data, req, () =>
            sendFeedback(
                getSendFeedbackContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }
}

export const getSystemEndpointsGraphQLController = makeSingletonFunc(
    () => new SystemEndpointsGraphQLController()
);
