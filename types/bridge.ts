import { type Address, type Hash, parseAbi } from "viem";

export interface BridgeTransactionWithUser {
  user: Address;
  messageHash: Hash;
  amount: bigint;
  token: Address;
  fromChain: number;
  toChain: number;
  recipient: Address;
  timestamp: bigint;
  nonce: bigint;
  status: BridgeStatus;
  txHash: string;
}

export interface GlobalAnalytics {
  totalAmount: bigint;
  totalTxns: number;
  txns: BridgeTransactionWithUser[];
}

export interface GlobalAnalyticsSummary {
  totalAmount: bigint;
  totalTxns: number;
  totalUsers: number;
}

export interface PaginatedAnalytics {
  totalAmount: bigint;
  totalTxns: number;
  txns: BridgeTransactionWithUser[];
  hasMore: boolean;
}

export enum BridgeStatus {
  INITIATED = 0,
  COMPLETED = 1,
  FAILED = 2,
}

export interface BridgeParams {
  fromChainId: number;
  toChainId: number;
  token: Address;
  amount: string;
  recipient: Address;
  decimals: number;
}

export interface BridgeResult {
  txHash: Hash;
  nonce: bigint;
  bridgeId: string;
}


export type BridgeRecord = {
  id: string;
  ts: number;
  fromChainId: number;
  toChainId: number;
  token: string;
  amount: string; // human
  status: "pending" | "completed" | "failed";
};
