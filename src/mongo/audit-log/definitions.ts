import { Document } from "mongoose";

export interface IAuditLogChange {
  customId: string;
  newValue: any;
  oldValue: any;
}

const resourceTypes = {
  user: "user",
  org: "org",
  group: "group",
  project: "project",
};

export enum AuditLogResourceType {
  User = "user",
  Org = "org",
  Group = "group",
  Project = "project",
  Task = "task",
  Status = "status",
  Label = "label",
  CollaborationRequest = "collaboration-request",
}

export enum AuditLogActionType {
  Create = "create",
  Update = "update",
  Delete = "delete",
}

export interface IAuditLog {
  customId: string;
  action: string;
  date: Date;
  resourceId: string;
  resourceType: AuditLogResourceType;
  userId: string;
  organizationId: string;
  createdAt: Date;
  change?: IAuditLogChange;

  // justification: string; // why were they allowed to perform this action?
  // reason: string;
  // meta: any;
  // ipAddress: string; // respect do not track?
  // requestedWithDoNotTrack: boolean;
  // // operatingSystem: string;
  // userAgent: string;
  // chainId: string; // or threadId, if the action is part of a series of actions

  // serverId: string;
  // instanceId: string;

  // clientId: string;
  // userToken: string;

  // requestId: string;
  // responseTime: number;
  // requestStart: string;
  // requestEnd: string;
  // fn: string;
  // start: string;
  // end: string;
  // duration: number;
  // caller: string;
  // error: string;
  // feature: string;
  // componentId: string;
  // eventType: string;

  // env: string;
  // level: string;
  // message: string;

  // type: string;
  // file: string;
  // line: string;
}

export interface IAuditLogDocument extends IAuditLog, Document {}

// TODO: keeping for analysis of a serialized log
// 2020-05-16T07:14:04.781150+00:00 heroku[router]: at=info method=OPTIONS path="/graphql" host=api.softkave.com request_id=bc59d627-4364-4805-be04-56d2972a061a fwd="105.112.60.217" dyno=web.1 connect=0ms service=2ms status=200 bytes=324 protocol=https
// 2020-05-16T07:14:04.998033+00:00 heroku[router]: at=info method=POST path="/graphql" host=api.softkave.com request_id=1db7f784-7cba-46f2-b081-abdb5a32ffaa fwd="105.112.60.217" dyno=web.1 connect=0ms service=7ms status=200 bytes=457 protocol=https
// 2020-05-16T07:14:05.000208+00:00 app[web.1]: [winston] Attempt to write logs with no transports {"isJoi":true,"name":"ValidationError","details":[{"message":"\"password\" length must be at least 7 characters long","path":["password"],"type":"string.min","context":{"limit":7,"value":"qwerty","key":"password","label":"password"}}],"_object":{"email":"temmyjay001@gmail.com","password":"qwerty"},"level":"info"}

const auditLogSchema = {
  customId: { type: String, unique: true },
  action: { type: String },
  date: { type: Date },
  resourceId: { type: String },
  resourceType: { type: String },
  userId: { type: String },
  organizationId: { type: String },
  createdAt: { type: Date },
};

export default auditLogSchema;