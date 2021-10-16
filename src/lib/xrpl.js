"use strict";
exports.__esModule = true;
// import RippleAPI from "ripple-lib";
var dotenv_1 = require("dotenv");
var redis_1 = require("./redis");
var RippleAPI = require("ripple-lib").RippleAPI;
dotenv_1["default"].config();
var xrpl = new RippleAPI({ server: process.env.RIPPLED_WEBSOCKET });
xrpl
    .connect()
    .then(function () { })["catch"](function (error) {
    console.error(error);
});
xrpl.on("connected", function () {
    console.log("Connected to XRPL node: " + process.env.RIPPLED_WEBSOCKET);
    xrpl.request("subscribe", { streams: ["validations"] })["catch"](function (error) {
        console.error("[ERROR] Validation stream subscription failed: " + error);
    });
});
xrpl.on("disconnected", function (code) {
    console.log("Disconnected from rippled. Code: " + code);
});
xrpl.on("error", function (code, message) {
    console.error("rippled error: " + code + ": " + message);
});
/**
 * Subscribe to validation stream and listen to validationReceived messages.
 */
xrpl.connection.on("validationReceived", function (vm) {
    console.log(vm.validation_public_key + ":" + vm.ledger_index);
    if (vm.master_key || vm.validation_public_key) {
        var VM_KEY = vm.master_key || vm.validation_public_key;
        if (process.env.PEER_PRIVATE === "false") {
            var PEER_NAME = process.env.PEER_NAME || process.env.HOSTNAME;
            Object.assign(vm, { peer: PEER_NAME });
        }
        redis_1["default"].hset("l:" + vm.ledger_index, VM_KEY, JSON.stringify(vm), function () { });
    }
});
exports["default"] = xrpl;
