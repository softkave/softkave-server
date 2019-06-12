const randomColor = require("randomcolor");
const UserModel = require("../mongo/UserModel");

const userModel = new UserModel({ connection: null });

async function check() {
  const count = await userModel.model.count({ color: null }).exec();

  if (count > 0) {
    return false;
  }

  return true;
}

async function addColorAvatarToUsers() {
  let limit = 50;
  let users = [];
  let lastTimestamp = Date.now();
  let sum = 0;

  console.log("script started");
  console.log("-- script name: addColorAvatarToUsers");

  do {
    let bulkUpdateData = [];
    users = await userModel.model
      .find({ createdAt: { $lte: lastTimestamp }, color: null }, "color")
      .limit(limit)
      .exec();

    users.forEach(user => {
      if (!user.color) {
        bulkUpdateData.push({
          updateOne: {
            filter: { _id: user._id },
            update: { color: randomColor() }
          }
        });
      }
    });

    if (bulkUpdateData.length > 0) {
      await userModel.model.bulkWrite(bulkUpdateData);
    }

    if (users.length > 0) {
      lastTimestamp = users[users.length - 1].createdAt;
      sum += users.length;
    }
  } while (users.length > 0);

  if (await check()) {
    console.log("-- update successful");
  } else {
    console.log("-- update failed: missed some documents");
  }

  console.log(`-- updated ${sum} documents`);
  console.log("script complete");
}

addColorAvatarToUsers();
