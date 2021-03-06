import http from "http";
import express from "express";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";
import ValidationController from "./src/controllers/ValidationController";
import PingController from "./src/controllers/PingController";
import "./src/lib/xrpl";
import "./src/lib/redis";
import "./src/lib/peersync";

dotenv.config();
const router = express();
router.use(compression({}));
router.use(cors({ origin: "*" }));

// Controllers
router.use("/api/v1/validations", ValidationController);
router.use("/api/v1/ping", PingController);

process.on("uncaughtException", () => {
  process.exit(1);
});
process.on("unhandledRejection", () => {
  process.exit(1);
});

const { PORT = 3000 } = process.env;
const server = http.createServer(router);
server.listen(PORT, () => {
  console.log(`Server is running: http://localhost:${PORT}`);
});
