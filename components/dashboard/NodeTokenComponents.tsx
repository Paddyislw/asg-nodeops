"use client"

import { Crown, BarChart3, DollarSign, TrendingUp, Calendar } from "lucide-react"
import { formatAmount } from "@/lib/helper"
import { CURRENT_NODE_CONFIG, type NodeTier } from "@/lib/node-token"
import type { NodeHolderData, UserAnalytics } from "@/lib/node-service"
import { BRIDGE_CHAINS } from "@/lib/constants"

const TIER_STYLES = {
  NONE: {
    text: "text-muted-foreground",
    icon: "👤",
  },
  BRONZE: {
    text: "text-primary",
    icon: "🥉",
  },
  SILVER: {
    text: "text-primary",
    icon: "🥈",
  },
  GOLD: {
    text: "text-primary",
    icon: "🥇",
  },
  DIAMOND: {
    text: "text-primary",
    icon: "💎",
  },
}

interface NodeStatusCardProps {
  nodeData: NodeHolderData | null
  loading?: boolean
}

export function NodeStatusCard({ nodeData, loading }: NodeStatusCardProps) {
  if (loading) {
    return (
      <div className="bg-card/50 hover:bg-card/80 border-border rounded-lg p-6 border animate-pulse">
        <div className="h-6 bg-muted rounded mb-4"></div>
        <div className="h-4 bg-muted rounded mb-2"></div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
      </div>
    )
  }

  if (!nodeData || nodeData.tier === "NONE") {
    return (
      <div className="bg-card/50 hover:bg-card/80 border-border rounded-lg p-6 border">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="text-muted-foreground" size={20} />
          <div>
            <h3 className="font-semibold text-muted-foreground">No $NODE Holdings</h3>
            <p className="text-sm text-muted-foreground">Hold $NODE to unlock premium features</p>
          </div>
        </div>
        <div className="text-sm space-y-2">
          <div className="flex justify-between items-center p-3 bg-muted rounded">
            <span>Analytics:</span>
            <span className="text-destructive">❌</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted rounded">
            <span>Fee Discount:</span>
            <span className="text-muted-foreground">0%</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted rounded">
            <span>Max Bridge:</span>
            <span className="text-muted-foreground">$1,000</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-primary/10 rounded text-center text-sm text-primary border border-primary/20">
          Get $NODE tokens to unlock benefits
        </div>
      </div>
    )
  }

  const style = TIER_STYLES[nodeData.tier]
  const balance = formatAmount(nodeData.balance, CURRENT_NODE_CONFIG.decimals)

  return (
    <div className="bg-card/50 hover:bg-card/80 border-border rounded-lg p-6 border">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">{style.icon}</div>
        <div>
          <h3 className={`font-semibold text-lg ${style.text}`}>{nodeData.tier} Tier</h3>
          <p className="text-sm text-muted-foreground font-mono">{balance} $NODE</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between p-3 bg-muted rounded">
          <span className="flex items-center gap-2">
            <BarChart3 size={14} />
            Analytics:
          </span>
          <span className={nodeData.benefits.analytics ? "text-primary" : "text-destructive"}>
            {nodeData.benefits.analytics ? "✅" : "❌"}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted rounded">
          <span className="flex items-center gap-2">
            <DollarSign size={14} />
            Fee Discount:
          </span>
          <span className="text-primary">{nodeData.benefits.feeDiscount}%</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted rounded">
          <span className="flex items-center gap-2">
            <Calendar size={14} />
            Historical Data:
          </span>
          <span className={nodeData.benefits.historicalDataAccess ? "text-primary" : "text-destructive"}>
            {nodeData.benefits.historicalDataAccess ? "✅" : "❌"}
          </span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-muted rounded text-center text-sm">
        <span className="text-muted-foreground">Max Bridge: </span>
        <span className="text-primary font-semibold">${formatAmount(nodeData.benefits.maxBridgeAmount, 6)} USDC</span>
      </div>
    </div>
  )
}

interface NodeTierBadgeProps {
  tier: NodeTier
  className?: string
}

export function NodeTierBadge({ tier, className = "" }: NodeTierBadgeProps) {
  if (tier === "NONE") return null

  const style = TIER_STYLES[tier]

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 ${className}`}
    >
      <span>{style.icon}</span>
      <span>{tier} Tier</span>
    </div>
  )
}

interface AnalyticsDashboardProps {
  analytics: UserAnalytics
  hasAccess: boolean
  hasAdvancedAccess?: boolean
}

export function AnalyticsDashboard({ analytics, hasAccess, hasAdvancedAccess = false }: AnalyticsDashboardProps) {
  if (!hasAccess) {
    return (
      <div className="bg-card/50 hover:bg-card/80 border-border rounded-lg p-8 border text-center">
        <BarChart3 className="mx-auto mb-4 text-muted-foreground" size={48} />
        <h3 className="font-semibold text-lg mb-2">Analytics Dashboard</h3>
        <p className="text-muted-foreground mb-4">Hold $NODE tokens to unlock detailed bridge analytics</p>
        <div className="text-sm text-primary bg-primary/10 px-3 py-1 rounded border border-primary/20 inline-block">
          Available for Bronze tier and above
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card/50 hover:bg-card/80 border-border rounded-lg p-6 border">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="text-primary" size={20} />
        <h3 className="font-semibold text-lg">Analytics Dashboard</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted rounded p-4 text-center">
          <div className="text-sm text-muted-foreground mb-1">Total Bridged</div>
          <div className="text-xl font-semibold text-foreground">${analytics.totalBridged}</div>
        </div>

        <div className="bg-muted rounded p-4 text-center">
          <div className="text-sm text-muted-foreground mb-1">Total Bridges</div>
          <div className="text-xl font-semibold text-foreground">{analytics.bridgeCount}</div>
        </div>
      </div>

      {analytics.favoriteChains && analytics.favoriteChains.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <TrendingUp size={14} />
            Favorite Routes
          </h4>
          <div className="space-y-2">
            {analytics.favoriteChains.slice(0, 3).map((route, index) => {
              const fromChain = Object.values(BRIDGE_CHAINS).find((c) => c.id === route.fromChain)
              const toChain = Object.values(BRIDGE_CHAINS).find((c) => c.id === route.toChain)

              return (
                <div key={index} className="flex items-center justify-between text-sm bg-muted rounded p-3">
                  <span>
                    {fromChain?.name || route.fromChain} → {toChain?.name || route.toChain}
                  </span>
                  <span className="text-muted-foreground">{route.count}x</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {analytics.lastBridgeDate && (
        <div className="text-sm text-muted-foreground text-center bg-muted p-2 rounded">
          Last bridge: {new Date(analytics.lastBridgeDate).toLocaleDateString()}
        </div>
      )}
    </div>
  )
}

interface FeeDiscountDisplayProps {
  originalFee: bigint
  discountPercent: number
  discountAmount: bigint
  finalFee: bigint
  tier: NodeTier
}

export function FeeDiscountDisplay({
  originalFee,
  discountPercent,
  discountAmount,
  finalFee,
  tier,
}: FeeDiscountDisplayProps) {
  if (discountPercent === 0) return null

  return (
    <div className="bg-card/50 hover:bg-card/80 border-border rounded border p-3 text-sm">
      <div className="flex items-center gap-2 mb-2">
        <DollarSign size={12} className="text-primary" />
        <span className="font-medium text-primary">
          {tier} Fee Discount ({discountPercent}%)
        </span>
      </div>

      <div className="space-y-1 text-muted-foreground">
        <div className="flex justify-between">
          <span>Original Fee:</span>
          <span className="line-through">${formatAmount(originalFee, 6)}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount:</span>
          <span className="text-primary">-${formatAmount(discountAmount, 6)}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Final Fee:</span>
          <span className="text-primary">${formatAmount(finalFee, 6)}</span>
        </div>
      </div>
    </div>
  )
}

interface TierProgressProps {
  currentBalance: bigint
  currentTier: NodeTier
}

export function TierProgress({ currentBalance, currentTier }: TierProgressProps) {
  const tiers = [
    { name: "BRONZE" as NodeTier, threshold: BigInt("5000000") },
    { name: "SILVER" as NodeTier, threshold: BigInt("8000000") },
    { name: "GOLD" as NodeTier, threshold: BigInt("10000000") },
    { name: "DIAMOND" as NodeTier, threshold: BigInt("100000000") },
  ]

  const currentTierIndex = tiers.findIndex((t) => t.name === currentTier)
  const nextTier = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null

  if (!nextTier || currentTier === "DIAMOND") {
    return (
      <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary/20">
        <div className="text-3xl mb-2">💎</div>
        <div className="text-primary mb-1 font-semibold">Maximum Tier Achieved</div>
        <div className="text-sm text-muted-foreground">You&apos;ve reached the highest $NODE tier!</div>
      </div>
    )
  }

  const progress = (Number(currentBalance) / Number(nextTier.threshold)) * 100
  const needed = nextTier.threshold - currentBalance

  return (
    <div className="bg-card/50 hover:bg-card/80 border-border rounded-lg p-4 border">
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium">Progress to {nextTier.name}</span>
        <span className="text-sm text-muted-foreground">{Math.min(progress, 100).toFixed(1)}%</span>
      </div>

      <div className="w-full bg-muted rounded-full h-2 mb-3">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="text-sm text-muted-foreground text-center">
        Need{" "}
        <span className="text-primary font-medium">
          {formatAmount(needed, CURRENT_NODE_CONFIG.decimals)} more $NODE
        </span>
      </div>
    </div>
  )
}
