import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import SendFeedbackContext from "./sendFeedback/context";
import sendFeedback from "./sendFeedback/sendFeedback";

export default class SystemEndpointsGraphQLController {
    public static sendFeedback(data, req) {
        return wrapEndpoint(data, req, () =>
            sendFeedback(
                new SendFeedbackContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }
}
