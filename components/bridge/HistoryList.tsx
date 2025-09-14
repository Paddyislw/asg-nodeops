import type { BridgeRecord } from "@/types/bridge"
import { BRIDGE_CHAINS, TOKENS } from "@/lib/constants"

export function HistoryList({
  items,
  isLoading,
}: {
  items: BridgeRecord[]
  isLoading: boolean
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-400 text-sm">Loading history...</span>
        </div>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-slate-400 text-sm">No bridge history yet</p>
        <p className="text-slate-500 text-xs mt-1">Your completed bridges will appear here</p>
      </div>
    )
  }

  const getChainInfo = (chainId: number) => {
    return Object.values(BRIDGE_CHAINS).find((c) => c.id === chainId) || { name: `Chain ${chainId}`, explorerUrl: "" }
  }

  const getTokenInfo = (address: string, chainId: number) => {
    const tokens = TOKENS[chainId] || []
    return (
      tokens.find((t) => t.address.toLowerCase() === address.toLowerCase()) || {
        symbol: "Unknown",
        name: "Unknown Token",
      }
    )
  }

  return (
    <div className="space-y-4 max-h-[550px] overflow-y-auto scroll-hidden">
      {items.map((item, index) => {
        const fromChain = getChainInfo(item.fromChainId)
        const toChain = getChainInfo(item.toChainId)
        const tokenInfo = getTokenInfo(item.token, item.fromChainId)

        return (
          <div
            key={index}
            className="rounded-xl border border-slate-600/50 bg-slate-700/30 p-4 transition-all duration-200 hover:bg-slate-600/30 hover:border-slate-500/50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    {new Date(item.ts).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-400">
                    {new Date(item.ts).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                    item.status === "completed"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : item.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-white">{item.amount}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-blue-400">{tokenInfo.symbol}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="flex flex-col items-start">
                <span className="text-xs text-slate-400 mb-1">From</span>
                <span className="text-sm font-medium text-white">{fromChain.name}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-400 mb-1">To</span>
                <span className="text-sm font-medium text-white">{toChain.name}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-600/30">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-400">Token Address:</span>
                <span className="text-xs font-mono text-slate-300 bg-slate-800/50 px-2 py-1 rounded break-all">
                  {item.token}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
