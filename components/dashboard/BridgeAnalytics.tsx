"use client"

import { Activity } from "lucide-react"

interface BridgeTransaction {
  txHash: string
  amount: string
  status: "completed" | "pending"
  timeTaken: null
}

interface BridgeAnalyticsProps {
  hasAnalyticsAccess: boolean
  totalAmount: string
  totalTxns: number
  txns: BridgeTransaction[]
}

export function BridgeAnalytics({ hasAnalyticsAccess, totalAmount, totalTxns, txns }: BridgeAnalyticsProps) {
  if (!hasAnalyticsAccess || totalTxns === 0) {
    return null
  }

  return (
    <div className="bg-card/50 hover:bg-card/80 border-border rounded-lg p-6 border">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Activity size={20} className="text-primary" />
        Bridge Analytics
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground mb-1">${totalAmount}</div>
          <div className="text-xs text-muted-foreground">Total Volume</div>
        </div>

        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground mb-1">{totalTxns}</div>
          <div className="text-xs text-muted-foreground">Transactions</div>
        </div>

        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground mb-1">{totalTxns}</div>
          <div className="text-xs text-muted-foreground">Total Bridges</div>
        </div>

        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground mb-1">
            {txns.filter((t) => t.status === "completed").length}
          </div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>
      </div>

      {txns.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4 text-foreground">Recent Transactions</h4>
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-black sticky top-0 z-10">
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-muted-foreground font-semibold text-sm">Transaction Hash</th>
                    <th className="text-right p-4 text-muted-foreground font-semibold text-sm">Amount</th>
                    <th className="text-center p-4 text-muted-foreground font-semibold text-sm">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {txns.map((txn, index) => (
                    <tr key={index} className="hover:bg-muted/20 transition-colors duration-150">
                      <td className="p-4">
                        <div className="font-mono text-sm text-foreground bg-muted/30 px-3 py-1.5 rounded-md inline-block">
                          {txn.txHash.slice(0, 10)}...{txn.txHash.slice(-8)}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="text-foreground font-semibold text-sm">
                          ${txn.amount}
                        </div>
                        <div className="text-muted-foreground text-xs">USDC</div>
                      </td>
                      <td className="p-4 text-center">
                        <a
                          href={`https://sepolia.etherscan.io/tx/${txn.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm"
                        >
                          View on Etherscan
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}