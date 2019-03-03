const { blockValidator } = require("./validator");

test("false block", done => {
  const falseBlock = {
    name: "+++",
    type: "john"
  };

  blockValidator.validate(falseBlock, (err, fields) => {
    console.log(err, fields);
    throw err;
  });
});
