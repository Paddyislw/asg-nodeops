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
          <h4 className="text-sm font-medium mb-3">Recent Transactions</h4>
          <div className="bg-muted rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-background sticky top-0">
                  <tr>
                    <th className="text-left p-3 text-muted-foreground font-medium">Transaction Hash</th>
                    <th className="text-right p-3 text-muted-foreground font-medium">Amount</th>
                    <th className="text-center p-3 text-muted-foreground font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {txns.slice(0, 10).map((txn, index) => (
                    <tr key={index} className="border-t border-border hover:bg-background/50">
                      <td className="p-3">
                        <div className="font-mono text-foreground">
                          {txn.txHash.slice(0, 5)}...{txn.txHash.slice(-5)}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="text-foreground font-medium">${txn.amount}</div>
                      </td>
                      <td className="p-3 text-center">
                        <a
                          href={`https://sepolia.etherscan.io/tx/${txn.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 underline transition-colors"
                        >
                          View
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