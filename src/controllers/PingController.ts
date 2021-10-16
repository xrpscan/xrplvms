import express, { Request, Response, NextFunction, Router } from "express";
import { sign } from "../lib/pki";

const PingController: Router = express.Router();

PingController.use("/", (req: Request, res: Response, next: NextFunction) => {
  req.messages = { ping: "pong" };
  next();
});

PingController.route("/").get((req: Request, res: Response) => {
  return res.status(200).send(sign(req.messages));
});

PingController.route("/raw").get((req: Request, res: Response) => {
  return res.status(200).send(req.messages);
});

export default PingController;
