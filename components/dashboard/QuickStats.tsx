"use client"

import { TrendingUp, BarChart3 } from "lucide-react"
import { formatAmount } from "@/lib/helper"
import { CURRENT_NODE_CONFIG, NODE_TIERS } from "@/lib/node-token"
import type { NodeHolderData } from "@/lib/node-service"

interface QuickStatsProps {
  hasAnalyticsAccess: boolean
  totalAmount: string
  totalTxns: number
  nodeData: NodeHolderData | null
  loading: boolean
  error: string | null
}

export function QuickStats({ hasAnalyticsAccess, totalAmount, totalTxns, nodeData, loading, error }: QuickStatsProps) {
  return (
    <div className="bg-card/50 hover:bg-card/80 border-border rounded-lg p-6 border">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-primary" />
        Quick Stats
      </h3>

      {hasAnalyticsAccess && totalTxns > 0 ? (
        <div className="space-y-4">
          {loading && (
            <div className="text-center text-sm text-muted-foreground">Loading bridge analytics...</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Total Amount</div>
              <div className="text-lg font-semibold text-foreground">${totalAmount}</div>
            </div>

            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Total Transactions</div>
              <div className="text-lg font-semibold text-foreground">{totalTxns}</div>
            </div>

            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Total Bridges</div>
              <div className="text-lg font-semibold text-foreground">{totalTxns}</div>
            </div>

            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Current Tier</div>
              <div className="text-lg font-semibold text-primary">{nodeData?.tier || "NONE"}</div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded p-2 border border-destructive/20">
              Error: {error}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <BarChart3 className="mx-auto mb-3 text-muted-foreground" size={48} />
          <p className="text-muted-foreground text-sm mb-2">Analytics Locked</p>
          <p className="text-xs text-muted-foreground">
            Hold {formatAmount(NODE_TIERS.BRONZE, CURRENT_NODE_CONFIG.decimals)} $NODE to unlock
          </p>
        </div>
      )}
    </div>
  )
}