import makeSingletonFn from "../../utilities/createSingletonFunc";
import { wrapEndpointREST } from "../wrapEndpointREST";
import { getSendFeedbackContext } from "./sendFeedback/context";
import sendFeedback from "./sendFeedback/sendFeedback";

export default class SystemEndpointsGraphQLController {
    public sendFeedback = wrapEndpointREST(
        sendFeedback,
        getSendFeedbackContext()
    );
}

export const getSystemEndpointsGraphQLController = makeSingletonFn(
    () => new SystemEndpointsGraphQLController()
);
