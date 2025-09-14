"use client"

import { Info } from "lucide-react"
import { formatAmount } from "@/lib/helper"
import { CURRENT_NODE_CONFIG } from "@/lib/node-token"
import type { NodeHolderData } from "@/lib/node-service"
import { NodeTierBadge } from "./NodeTokenComponents"

interface TokenInformationProps {
  nodeData: NodeHolderData | null
}

export function TokenInformation({ nodeData }: TokenInformationProps) {
  return (
    <div className="bg-card/50 hover:bg-card/80 rounded-lg p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Info size={20} className="text-primary" />
        Token Information
      </h3>

      <div className="space-y-4">
        <div className="bg-muted rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Contract Address</div>
          <div className="font-mono text-sm text-foreground break-all">{CURRENT_NODE_CONFIG.address}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted rounded-lg p-3 text-center">
            <div className="text-xs text-muted-foreground mb-1">Symbol</div>
            <div className="font-semibold text-primary">{CURRENT_NODE_CONFIG.symbol}</div>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <div className="text-xs text-muted-foreground mb-1">Decimals</div>
            <div className="font-semibold">{CURRENT_NODE_CONFIG.decimals}</div>
          </div>
        </div>

        {nodeData && (
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <div className="text-sm text-muted-foreground mb-1">Your Balance</div>
            <div className="text-2xl font-bold text-primary">
              {formatAmount(nodeData.balance, CURRENT_NODE_CONFIG.decimals)} $NODE
            </div>
            {nodeData.tier !== "NONE" && (
              <div className="mt-2">
                <NodeTierBadge tier={nodeData.tier} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}