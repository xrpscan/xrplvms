"use strict";
exports.__esModule = true;
var express_1 = require("express");
var pki_1 = require("../lib/pki");
var PingController = express_1["default"].Router();
PingController.use("/", function (req, res, next) {
    req.messages = { ping: "pong" };
    next();
});
PingController.route("/").get(function (req, res) {
    return res.status(200).send(pki_1.sign(req.messages));
});
PingController.route("/raw").get(function (req, res) {
    return res.status(200).send(req.messages);
});
exports["default"] = PingController;
