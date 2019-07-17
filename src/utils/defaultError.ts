import blockError, {
  blockErrorFields,
  blockErrorMessages
} from "../endpoints/block/blockError";
import userError, {
  userErrorFields,
  userErrorMessages
} from "../endpoints/user/userError";
import notificationError, {
  notificationErrorFields,
  notificationErrorMessages
} from "./notificationError";
import serverError, {
  serverErrorFields,
  serverErrorMessages
} from "./serverError";
import validationError, {
  validationErrorFields,
  validationErrorMessages
} from "./validationError";

const errorMessages = {
  notification: notificationErrorMessages,
  server: serverErrorMessages,
  user: userErrorMessages,
  validation: validationErrorMessages,
  block: blockErrorMessages
};

const errorFields = {
  notification: notificationErrorFields,
  server: serverErrorFields,
  user: userErrorFields,
  validation: validationErrorFields,
  block: blockErrorFields
};

const error = {
  notification: notificationError,
  server: serverError,
  user: userError,
  validation: validationError,
  block: blockError
};

export default error;
export { errorFields, errorMessages };
