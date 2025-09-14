"use client"

import { Award, DollarSign, TrendingUp, BarChart3 } from "lucide-react"
import { formatAmount } from "@/lib/helper"
import { CURRENT_NODE_CONFIG, NODE_TIERS, TIER_BENEFITS } from "@/lib/node-token"
import type { NodeHolderData } from "@/lib/node-service"

interface BenefitsDisplayProps {
  nodeData: NodeHolderData | null
}

export function BenefitsDisplay({ nodeData }: BenefitsDisplayProps) {
  return (
    <div className="space-y-6">
      {nodeData && nodeData.tier !== "NONE" && (
        <div className="bg-card/50 hover:bg-card/80 border-border rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award size={20} className="text-primary" />
            Your Current Benefits ({nodeData.tier} Tier)
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="flex items-center gap-2">
                  <DollarSign size={16} className="text-primary" />
                  Fee Discount
                </span>
                <span className="font-semibold text-primary">{nodeData.benefits.feeDiscount}%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary" />
                  Max Bridge Amount
                </span>
                <span className="font-semibold text-primary">
                  ${formatAmount(nodeData.benefits.maxBridgeAmount, 6)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="flex items-center gap-2">
                  <BarChart3
                    size={16}
                    className={nodeData.benefits.analytics ? "text-primary" : "text-muted-foreground"}
                  />
                  Analytics Access
                </span>
                <span className={nodeData.benefits.analytics ? "text-primary" : "text-muted-foreground"}>
                  {nodeData.benefits.analytics ? "✅" : "❌"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Tiers Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(TIER_BENEFITS)
          .filter(([tier]) => tier !== "NONE")
          .map(([tier, benefits]) => {
            const tierKey = tier as keyof typeof TIER_BENEFITS
            const isCurrentTier = nodeData?.tier === tier
            const tierThreshold = NODE_TIERS[tierKey as keyof typeof NODE_TIERS]

            return (
              <div
                key={tier}
                className={`bg-card/50 hover:bg-card/80 border-border rounded-lg p-4 border transition-colors ${
                  isCurrentTier ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="text-center mb-4">
                  <div className="text-2xl mb-2">
                    {tier === "BRONZE" && "🥉"}
                    {tier === "SILVER" && "🥈"}
                    {tier === "GOLD" && "🥇"}
                    {tier === "DIAMOND" && "💎"}
                  </div>
                  <h4 className="font-semibold">{tier} Tier</h4>
                  <p className="text-xs text-muted-foreground">
                    {formatAmount(tierThreshold, CURRENT_NODE_CONFIG.decimals)} $NODE
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Fee Discount:</span>
                    <span className="text-primary">{benefits.feeDiscount}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Bridge:</span>
                    <span className="text-primary">${formatAmount(benefits.maxBridgeAmount, 6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Analytics:</span>
                    <span className={benefits.analytics ? "text-primary" : "text-muted-foreground"}>
                      {benefits.analytics ? "✅" : "❌"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Advanced:</span>
                    <span className={benefits.advancedAnalytics ? "text-primary" : "text-muted-foreground"}>
                      {benefits.advancedAnalytics ? "✅" : "❌"}
                    </span>
                  </div>
                </div>

                {isCurrentTier && (
                  <div className="mt-3 p-2 bg-primary/20 rounded text-center text-xs text-primary">
                    Current Tier
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}