"use strict";
exports.__esModule = true;
var express_1 = require("express");
var redis_1 = require("../lib/redis");
var pki_1 = require("../lib/pki");
var ValidationController = express_1["default"].Router();
ValidationController.use("/:ledger_index", function (req, res, next) {
    req.ledger_index = req.params.ledger_index;
    if (req.ledger_index) {
        redis_1["default"].hgetall("l:" + req.ledger_index, function (err, messages) {
            if (!err && messages) {
                req.messages = messages;
                next();
            }
            else {
                return res.status(404).send("Error");
            }
        });
    }
    else {
        return res.status(404).send("Not found");
    }
});
ValidationController.route("/:ledger_index").get(function (req, res) {
    return res.status(200).send(pki_1.sign(req.messages));
});
ValidationController.route("/:ledger_index/raw").get(function (req, res) {
    return res.status(200).send(req.messages);
});
exports["default"] = ValidationController;
