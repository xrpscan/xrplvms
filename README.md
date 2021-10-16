# XRPLVMS

XRPLVMS (XRP Ledger Validation Message Service) is a service that helps create a P2P network to spool `validationReceived` messages emitted by `rippled`. Validation messages are ephemeral, therefore they must be saved as soon as they're emitted. If your service consumes XRPL Validation messages and needs to be offline momentarily (outage, application restart, upgrade), it can fetch missing Validation messages from the spool.

## Install

```bash
$ git clone https://github.com/xrpscan/xrplvms
$ cd xrplvms
$ cp .env.example .env
```

Generate a new public/private keypair using OpenSSL and store it in `./pki` directory. This keypair will be used for digitally signing Validation messages synced by the peers in the P2P network.

```bash
$ openssl genrsa -out pki/private.pem 2048
$ openssl rsa -in pki/private.pem -pubout -out pki/public.pem
```

Install dependencies, build the applicaiton and run on port 3000. Ensure Redis is running on localhost (update Redis settings in .env if its running elsewhere).

```bash
$ yarn
$ yarn build
$ node dist/server.js
```

Verify if everything works.

```bash
$ curl  "http://localhost:3000/api/v1/validations/<latest-ledger-index>"
```

## Usage

XRPLVMS provides two REST endpoints to sync Validation messages:

1. `/api/v1/validations/<ledger-index>` - Signed JWT with Validation messages available for a given _`ledger-index`_ as the payload. It can be verified with the public key generated above.
2. `/api/v1/validations/<ledger-index>/raw` - Raw Validation messages available for a given _`ledger-index`_.

## Change Log

See [CHANGELOG.md](CHANGELOG.md)