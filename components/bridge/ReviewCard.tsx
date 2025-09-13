import { BRIDGE_CHAINS } from "@/lib/constants";
import { Address } from "viem";

export function ReviewCard({
  fromChainId,
  toChainId,
  token,
  amount,
}: {
  fromChainId: number;
  toChainId: number;
  token: Address;
  amount: string;
}) {
  const CHAINS = Object.values(BRIDGE_CHAINS);
  const from = CHAINS.find((c) => c.id === fromChainId)!;
  const to = CHAINS.find((c) => c.id === toChainId)!;
  return (
    <div className="rounded-xl2 border border-white/10 bg-black/30 p-4 text-sm">
      <div className="flex justify-between">
        <span className="text-white/70">From</span>
        <span>{from.name}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/70">To</span>
        <span>{to.name}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/70">Token</span>
        <span>
          {token.slice(0, 6)}…{token.slice(-4)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/70">Amount</span>
        <span>{amount}</span>
      </div>
    </div>
  );
}
