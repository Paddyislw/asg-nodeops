import { BRIDGE_CHAINS } from "@/lib/constants";
import type { Address } from "viem";

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
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <div className="w-2 h-2 rounded-full bg-primary"></div>
        <h3 className="font-semibold text-foreground">Transaction Summary</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-muted-foreground">From Network</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{from.name}</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-muted-foreground">To Network</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{to.name}</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-muted-foreground">Token Address</span>
          <span className="font-mono text-sm text-foreground bg-muted/20 px-2 py-1 rounded">
            {token.slice(0, 6)}…{token.slice(-4)}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-border pt-3">
          <span className="text-sm text-muted-foreground">Amount</span>
          <span className="text-lg font-semibold text-primary">{amount}</span>
        </div>
      </div>
    </div>
  );
}
