declare namespace XRPL {
  export interface Ledger {
    stateHash: string;
    closeTime: string;
    closeTimeResolution: number;
    closeFlags: number;
    ledgerHash: string;
    ledgerVersion: number;
    parentLedgerHash: string;
    parentCloseTime: string;
    totalDrops: string;
    transactionHash: string;
  }
}
