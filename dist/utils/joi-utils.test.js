"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=joi-utils.test.js.map