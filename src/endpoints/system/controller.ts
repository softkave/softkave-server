import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../contexts/RequestData";
import { wrapEndpoint } from "../utils";
import SendFeedbackContext from "./sendFeedback/context";
import sendFeedback from "./sendFeedback/sendFeedback";

export default class SystemController {
    public sendFeedback(data, req) {
        return wrapEndpoint(data, req, () =>
            sendFeedback(
                new SendFeedbackContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }
}

const controller: SystemController = new SystemController();

export function getSystemController() {
    return controller;
}
