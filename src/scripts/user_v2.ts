import { Connection, Document } from "mongoose";
import { getDefaultConnection } from "../mongo/defaultConnection";
import MongoModel from "../mongo/MongoModel";
import { getUserModel, IUser, IUser0, userSchema0 } from "../mongo/user";

let usr0Model: MongoModel = null;

export function getUser0Model(conn: Connection) {
  if (usr0Model) {
    return usr0Model;
  }

  usr0Model = new MongoModel({
    modelName: "user",
    collectionName: "users",
    rawSchema: userSchema0,
    connection: conn,
  });

  return usr0Model;
}

export async function oldUserToNewUser() {
  console.log(`script - oldUserToNewUser - started`);

  let docsCount = 0;
  const user0Model = getUser0Model(getDefaultConnection().getConnection());
  await user0Model.model.ensureIndexes();
  const cursor = user0Model.model.find({}).cursor();
  const userModel = getUserModel(getDefaultConnection().getConnection());
  await userModel.model.ensureIndexes();

  try {
    for (
      let doc: IUser0 & Document = await cursor.next();
      doc !== null;
      doc = await cursor.next()
    ) {
      const notification: IUser = {
        customId: doc.customId,
        name: doc.name,
        email: doc.email,
        hash: doc.hash,
        createdAt: new Date(doc.createdAt).toString(),
        forgotPasswordHistory: doc.forgotPasswordHistory.map((item) =>
          new Date(item).toString()
        ),
        passwordLastChangedAt:
          doc.changePasswordHistory.length > 0
            ? new Date(
                doc.changePasswordHistory[doc.changePasswordHistory.length - 1]
              ).toString()
            : undefined,
        rootBlockId: doc.rootBlockId,
        orgs: doc.orgs.map((orgId) => ({ customId: orgId })),
        color: doc.color,
        notificationsLastCheckedAt: doc.lastNotificationCheckTime
          ? new Date(doc.lastNotificationCheckTime).toString()
          : undefined,
      };

      const newDoc = new userModel.model(notification);
      await newDoc.save();

      docsCount++;
    }

    cursor.close();
    console.log(`doc(s) count = ${docsCount}`);
    console.log(`script - oldUserToNewUser - completed`);
  } catch (error) {
    console.log(`script - oldUserToNewUser - error`);
    console.log("- - - - -");
    console.error(error);
    console.log("- - - - -");
  }
}
