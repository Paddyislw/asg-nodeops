import { BridgeRecord } from "@/types/bridge";

export function getStatusText(status: number): BridgeRecord["status"] {
  switch (status) {
    case 0:
      return "pending";
    case 1:
      return "completed";
    case 2:
      return "failed";
    default:
      return "pending";
  }
}

export const formatAmount = (v: bigint, decimals: number) =>
  (Number(v) / 10 ** decimals).toString();
export const parseAmount = (v: string, decimals: number) =>
  BigInt(Math.floor(Number(v) * 10 ** decimals));
