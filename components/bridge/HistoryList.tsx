import { BridgeRecord } from "@/types/bridge";

export function HistoryList({
  items,
  isLoading,
}: {
  items: BridgeRecord[];
  isLoading: boolean;
}) {
  if (isLoading)
    return <p className="text-white/50 text-sm">Loading history...</p>;
  if (!items.length)
    return <p className="text-white/50 text-sm">No history yet.</p>;
  return (
    <div className="space-y-2">
      {items.map((it, index) => (
        <div
          key={index}
          className="rounded-xl2 border border-white/10 bg-black/30 p-3 text-xs"
        >
          <div className="flex items-center justify-between">
            <span>{new Date(it.ts).toLocaleString()}</span>
            <span
              className={`px-2 py-0.5 rounded-full ${
                it.status === "completed"
                  ? "bg-green-500/20 text-green-300"
                  : it.status === "pending"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {it.status}
            </span>
          </div>
          <div className="mt-1 text-white/70">
            {it.amount} {it.token.slice(0, 6)}…{it.token.slice(-4)} |{" "}
            {it.fromChainId} → {it.toChainId}
          </div>
        </div>
      ))}
    </div>
  );
}
