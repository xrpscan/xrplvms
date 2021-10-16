import fetch from "node-fetch";
import fs from "fs";
import xrpl from "./xrpl";
import redisclient from "./redis";
import { verify } from "./pki";

const PEERS = [
  {name: "peer1", url: "http://peer1.xrpscan.com:3000", public_key: "peer1.pem"},
];

const MIN_SYNC_INTERVAL = 600;
const SYNC_INTERVAL = (process.env.PEER_SYNC_INTERVAL && Number(process.env.PEER_SYNC_INTERVAL) > MIN_SYNC_INTERVAL) ? Number(process.env.PEER_SYNC_INTERVAL) : MIN_SYNC_INTERVAL;

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const verifySignature = async (payload: string, peerPublicKey: Buffer) => {
  return await verify(payload, peerPublicKey);
};

const fetchValidations = async (url: string, ledger_index: number) => {
  const response = await fetch(`${url}/api/v1/validations/${ledger_index}`);
  const payload = await response.text();
  if (response.status === 200) {
    return payload;
  }
};

const updateValidations = (ledger_index: number) => {
  PEERS.map((peer) => {
    const peerPublicKey = fs.readFileSync(`${process.cwd()}/peers/${peer.public_key}`);
    console.log(`Syncing ledger ${ledger_index} from ${peer.url}`);
    fetchValidations(peer.url, ledger_index).then((payload) => {
      if (payload) {
        verifySignature(payload, peerPublicKey).then((validations) => {
          console.log(`Verifying ledger ${ledger_index} signature with ${peer.public_key}`);
          for (const [VM_KEY, vm] of Object.entries(validations)) {
            if (VM_KEY !== "iat") {
              redisclient.hset(`l:${ledger_index}`, VM_KEY, vm, () => {});
            }
          }
        }).catch((error) => {
          console.error(`Error: Ledger ${ledger_index} signature verification failed: ${error.message}`);
        });
      }
    }).catch((error) => {
      console.error(`Error: Ledger ${ledger_index} sync failed: ${error.message}`);
    });
  });
};

const sync = () => {
  if (xrpl.isConnected()) {
    xrpl.getLedger().then((ledger: XRPL.Ledger) => {
      const maxLedger = ledger.ledgerVersion;
      const minLedger = maxLedger - Number(process.env.LEDGER_HISTORY);

      console.log(`Examining validations in ledgers ${minLedger} - ${maxLedger}`)
      for (let ledger_index = minLedger; ledger_index <= maxLedger; ledger_index++) {
        redisclient.exists(`l:${ledger_index}`, (error, status) => {
          if (status === 0) {
            updateValidations(ledger_index);
          }
        });
      }
    }).catch((error: any) => {
      console.error(`XRPL getLedger(validated) error`);
    });
  }
};

setInterval(sync, 4000);
