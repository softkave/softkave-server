import {
  IRespondToCollaborationRequestContext,
  IRespondToCollaborationRequestResult
} from "./types";
import { validate } from "utils/joiUtils";
import { respondToCollaborationRequestJoiSchema } from "./validation";

async function respondToCollaborationRequest(
  context: IRespondToCollaborationRequestContext
): Promise<IRespondToCollaborationRequestResult> {
  const result = validate(context.data, respondToCollaborationRequestJoiSchema);
}
