import { buildSchema } from "graphql";
import AccessControlModel from "../mongo/access-control/AccessControlModel";
import BlockModel from "../mongo/block/BlockModel";
import NotificationModel from "../mongo/notification/NotificationModel";
import UserModel from "../mongo/user/UserModel";
import { utilitySchema } from "../utils/schema-utils";
import { BlockOperations, blockSchema } from "./block";
import indexSchema from "./schema";
import { UserOperations, userSchema } from "./user";

export interface IBaseOperationParameters {
  blockModel: BlockModel;
  userModel: UserModel;
  notificationModel: NotificationModel;
  accessControlModel: AccessControlModel;
}

// TODO: define all any types
class IndexOperations {
  public staticParams: any;

  constructor(params: any) {
    this.staticParams = params;
  }

  public async user() {
    return new UserOperations(this.staticParams);
  }

  public async block() {
    return new BlockOperations(this.staticParams);
  }
}

const rootSchema = `
  ${utilitySchema}
  ${userSchema}
  ${blockSchema}
  ${indexSchema}
`;

const compiledSchema = buildSchema(rootSchema);

export { IndexOperations, compiledSchema as indexSchema };
