// components/NodeTokenComponents.tsx
"use client";

import {
  Crown,
  BarChart3,
  Timer,
  DollarSign,
  TrendingUp,
  Activity,
  PieChart,
  Calendar,
} from "lucide-react";
import { formatAmount } from "@/lib/helper";
import { CURRENT_NODE_CONFIG, type NodeTier } from "@/lib/node-token";
import type { NodeHolderData, UserAnalytics } from "@/lib/node-service";
import { BRIDGE_CHAINS } from "@/lib/constants";

// Tier colors and icons
const TIER_STYLES = {
  NONE: {
    bg: "bg-gray-500/20",
    text: "text-gray-400",
    border: "border-gray-500/30",
    icon: "👤",
  },
  BRONZE: {
    bg: "bg-amber-600/20",
    text: "text-amber-400",
    border: "border-amber-600/30",
    icon: "🥉",
  },
  SILVER: {
    bg: "bg-slate-400/20",
    text: "text-slate-300",
    border: "border-slate-400/30",
    icon: "🥈",
  },
  GOLD: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    icon: "🥇",
  },
  DIAMOND: {
    bg: "bg-cyan-400/20",
    text: "text-cyan-300",
    border: "border-cyan-400/30",
    icon: "💎",
  },
};

interface NodeStatusCardProps {
  nodeData: NodeHolderData | null;
  loading?: boolean;
}

export function NodeStatusCard({ nodeData, loading }: NodeStatusCardProps) {
  if (loading) {
    return (
      <div className="rounded-xl2 bg-card p-4 shadow-soft animate-pulse">
        <div className="h-6 bg-white/10 rounded mb-2"></div>
        <div className="h-4 bg-white/5 rounded"></div>
      </div>
    );
  }

  if (!nodeData || nodeData.tier === "NONE") {
    return (
      <div className="rounded-xl2 bg-card p-4 shadow-soft border border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <Crown className="text-white/40" size={20} />
          <div>
            <h3 className="font-semibold text-white/70">No $NODE Holdings</h3>
            <p className="text-xs text-white/50">
              Hold $NODE to unlock premium features
            </p>
          </div>
        </div>
        <div className="text-xs text-white/60 space-y-1">
          <div className="flex justify-between">
            <span>Analytics:</span>
            <span className="text-red-400">❌</span>
          </div>
          <div className="flex justify-between">
            <span>Fee Discount:</span>
            <span className="text-white/40">0%</span>
          </div>
          <div className="flex justify-between">
            <span>Max Bridge:</span>
            <span className="text-white/40">$1,000</span>
          </div>
        </div>
        <div className="mt-3 p-2 bg-white/5 rounded-lg text-xs text-center text-white/60">
          Get $NODE tokens to unlock benefits
        </div>
      </div>
    );
  }

  const style = TIER_STYLES[nodeData.tier];
  const balance = formatAmount(nodeData.balance, CURRENT_NODE_CONFIG.decimals);

  return (
    <div
      className={`rounded-xl2 bg-card p-4 shadow-soft border ${style.border} ${style.bg}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="text-xl">{style.icon}</div>
        <div>
          <h3 className={`font-semibold ${style.text}`}>
            {nodeData.tier} Tier
          </h3>
          <p className="text-xs text-white/60">{balance} $NODE</p>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <BarChart3 size={12} />
            Analytics:
          </span>
          <span
            className={
              nodeData.benefits.analytics ? "text-green-400" : "text-red-400"
            }
          >
            {nodeData.benefits.analytics ? "✅" : "❌"}
          </span>
        </div>


        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <DollarSign size={12} />
            Fee Discount:
          </span>
          <span className="text-green-400">
            {nodeData.benefits.feeDiscount}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            Historical Data:
          </span>
          <span
            className={
              nodeData.benefits.historicalDataAccess
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {nodeData.benefits.historicalDataAccess ? "✅" : "❌"}
          </span>
        </div>
      </div>

      <div className="mt-3 p-2 bg-black/30 rounded-lg text-xs text-center text-white/70">
        Max Bridge: ${formatAmount(nodeData.benefits.maxBridgeAmount, 6)} USDC
      </div>
    </div>
  );
}

interface NodeTierBadgeProps {
  tier: NodeTier;
  className?: string;
}

export function NodeTierBadge({ tier, className = "" }: NodeTierBadgeProps) {
  if (tier === "NONE") return null;

  const style = TIER_STYLES[tier];

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text} ${style.border} border ${className}`}
    >
      <span>{style.icon}</span>
      <span>{tier} Tier</span>
    </div>
  );
}

interface AnalyticsDashboardProps {
  analytics: UserAnalytics;
  hasAccess: boolean;
  hasAdvancedAccess?: boolean;
}

export function AnalyticsDashboard({
  analytics,
  hasAccess,
  hasAdvancedAccess = false,
}: AnalyticsDashboardProps) {
  if (!hasAccess) {
    return (
      <div className="rounded-xl2 bg-card p-6 shadow-soft text-center">
        <BarChart3 className="mx-auto mb-3 text-white/40" size={48} />
        <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
        <p className="text-white/60 text-sm mb-4">
          Hold $NODE tokens to unlock detailed bridge analytics
        </p>
        <div className="text-xs text-white/40">
          Available for Bronze tier and above
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl2 bg-card p-6 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="text-primary" size={20} />
        <h3 className="font-semibold">Analytics Dashboard</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/30 rounded-lg p-3">
          <div className="text-xs text-white/60 mb-1">Total Bridged</div>
          <div className="text-lg font-semibold text-green-400">
            ${analytics.totalBridged}
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-3">
          <div className="text-xs text-white/60 mb-1">Total Bridges</div>
          <div className="text-lg font-semibold text-blue-400">
            {analytics.bridgeCount}
          </div>
        </div>
      </div>

      {analytics.favoriteChains && analytics.favoriteChains.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <TrendingUp size={14} />
            Favorite Routes
          </h4>
          <div className="space-y-2">
            {analytics.favoriteChains.slice(0, 3).map((route, index) => {
              const fromChain = Object.values(BRIDGE_CHAINS).find(
                (c) => c.id === route.fromChain
              );
              const toChain = Object.values(BRIDGE_CHAINS).find(
                (c) => c.id === route.toChain
              );

              return (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs bg-black/20 rounded p-2"
                >
                  <span>
                    {fromChain?.name || route.fromChain} →{" "}
                    {toChain?.name || route.toChain}
                  </span>
                  <span className="text-white/60">{route.count}x</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {analytics.lastBridgeDate && (
        <div className="mt-4 text-xs text-white/50 text-center">
          Last bridge: {new Date(analytics.lastBridgeDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

interface FeeDiscountDisplayProps {
  originalFee: bigint;
  discountPercent: number;
  discountAmount: bigint;
  finalFee: bigint;
  tier: NodeTier;
}

export function FeeDiscountDisplay({
  originalFee,
  discountPercent,
  discountAmount,
  finalFee,
  tier,
}: FeeDiscountDisplayProps) {
  if (discountPercent === 0) return null;

  const style = TIER_STYLES[tier];

  return (
    <div
      className={`rounded-lg border ${style.border} ${style.bg} p-3 text-xs`}
    >
      <div className="flex items-center gap-2 mb-2">
        <DollarSign size={12} className={style.text} />
        <span className={`font-medium ${style.text}`}>
          {tier} Fee Discount ({discountPercent}%)
        </span>
      </div>

      <div className="space-y-1 text-white/70">
        <div className="flex justify-between">
          <span>Original Fee:</span>
          <span className="line-through text-white/50">
            ${formatAmount(originalFee, 6)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Discount:</span>
          <span className="text-green-400">
            -${formatAmount(discountAmount, 6)}
          </span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Final Fee:</span>
          <span className={style.text}>${formatAmount(finalFee, 6)}</span>
        </div>
      </div>
    </div>
  );
}

interface TierProgressProps {
  currentBalance: bigint;
  currentTier: NodeTier;
}

export function TierProgress({
  currentBalance,
  currentTier,
}: TierProgressProps) {
  const tiers = [
    { name: "BRONZE" as NodeTier, threshold: BigInt("5000000") },
    { name: "SILVER" as NodeTier, threshold: BigInt("8000000") },
    { name: "GOLD" as NodeTier, threshold: BigInt("10000000") },
    {
      name: "DIAMOND" as NodeTier,
      threshold: BigInt("100000000"),
    },
  ];

  const currentTierIndex = tiers.findIndex((t) => t.name === currentTier);
  const nextTier =
    currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;

  if (!nextTier || currentTier === "DIAMOND") {
    return (
      <div className="text-center p-4 bg-cyan-400/10 rounded-lg border border-cyan-400/20">
        <div className="text-cyan-300 mb-1">💎 Maximum Tier Achieved</div>
        <div className="text-xs text-white/60">
          You've reached the highest $NODE tier!
        </div>
      </div>
    );
  }

  const progress = (Number(currentBalance) / Number(nextTier.threshold)) * 100;
  const needed = nextTier.threshold - currentBalance;

  return (
    <div className="bg-black/30 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Progress to {nextTier.name}</span>
        <span className="text-xs text-white/60">
          {Math.min(progress, 100).toFixed(1)}%
        </span>
      </div>

      <div className="w-full bg-white/10 rounded-full h-2 mb-2">
        <div
          className="bg-gradient-to-r from-primary to-yellow-400 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="text-xs text-white/60 text-center">
        Need {formatAmount(needed, CURRENT_NODE_CONFIG.decimals)} more $NODE
      </div>
    </div>
  );
}
