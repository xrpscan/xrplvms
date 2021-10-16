import dotenv from "dotenv";
import fs from "fs";
import jsonwebtoken from "jsonwebtoken";

dotenv.config();
const SIGNING_ALGORITHM = "RS256";
const privateKey = fs.readFileSync(`${process.cwd()}/pki/${process.env.XRPLVMS_PRIVATE_KEY}`);

export const sign = (payload: object): string => {
  return jsonwebtoken.sign(payload, privateKey, { algorithm: SIGNING_ALGORITHM });
};

export const verify = (payload: string, publicKey: Buffer) => {
  return jsonwebtoken.verify(payload, publicKey, { algorithms: [SIGNING_ALGORITHM] });
};
