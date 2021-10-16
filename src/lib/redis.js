"use strict";
exports.__esModule = true;
var dotenv_1 = require("dotenv");
var redis_1 = require("redis");
dotenv_1["default"].config();
var redisclient = redis_1["default"].createClient({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    prefix: process.env.REDIS_PREFIX + ":"
});
redisclient.on("connected", function () {
    console.log("Connected to Redis");
});
redisclient.on("disconnected", function () {
    console.log("Disconnected from Redis");
});
redisclient.on("error", function (error) {
    console.error(error);
});
exports["default"] = redisclient;
