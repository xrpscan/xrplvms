"use strict";
exports.__esModule = true;
exports.verify = exports.sign = void 0;
var dotenv_1 = require("dotenv");
var fs_1 = require("fs");
var jsonwebtoken_1 = require("jsonwebtoken");
dotenv_1["default"].config();
var SIGNING_ALGORITHM = "RS256";
var privateKey = fs_1["default"].readFileSync(process.cwd() + "/pki/" + process.env.XRPVMS_PRIVATE_KEY);
var sign = function (payload) {
    return jsonwebtoken_1["default"].sign(payload, privateKey, { algorithm: SIGNING_ALGORITHM });
};
exports.sign = sign;
var verify = function (payload, publicKey) {
    return jsonwebtoken_1["default"].verify(payload, publicKey, { algorithms: [SIGNING_ALGORITHM] });
};
exports.verify = verify;
