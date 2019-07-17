const Joi = require("joi");
const { validate } = require("./joi-utils");

const testSchema = Joi.object().keys({
  email: Joi.string()
    .required()
    .email(),
  password: Joi.string().required()
});

const goodTestData = {
  email: "a@ba.ca",
  password: "abcde"
};

const badTestData = {
  email: "i'm not an email",
  password: 20
};

// test("expect validate to work", () => {
//   expect(validate(goodTestData, testSchema)).toStrictEqual(goodTestData);
// });

// test("expect validate to fail", () => {
//   expect(() => validate(badTestData, testSchema)).toThrow();
// });

export {};
