import randomColor from "randomcolor";
import connection from "../mongo/defaultConnection";
import { IUserDocument } from "../mongo/user";
import UserModel from "../mongo/user/UserModel";

export default async function performUserUpdates() {
  // Lowercases user emails
  // Adds color avatar to users that have none
  console.log(`script - ${__filename} - started`);

  const userModel = new UserModel({ connection: connection.getConnection() });

  await userModel.model.init();

  const cursor = userModel.model.find({}, "email color").cursor();
  let docsCount = 0;

  try {
    for (
      let doc: IUserDocument = await cursor.next();
      doc !== null;
      doc = await cursor.next()
    ) {
      doc.email = doc.email.toLowerCase();

      if (!doc.color) {
        doc.color = randomColor();
      }

      await doc.save();
      docsCount++;
    }

    console.log(`updated ${docsCount} docs`);
    console.log(`script - ${__filename} - completed`);
  } catch (error) {
    console.log(`script - ${__filename} - error`);
    console.log("- - - - -");
    console.error(error);
    console.log("- - - - -");
  }
}
