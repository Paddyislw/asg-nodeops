"use client";

import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { useNodeToken } from "@/hooks/useNodeToken";
import {
  NodeStatusCard,
  NodeTierBadge,
  AnalyticsDashboard,
  TierProgress,
} from "@/components/NodeTokenComponents";
import {
  Crown,
  BarChart3,
  TrendingUp,
  DollarSign,
  Sparkles,
  Info,
  Award,
  Activity,
} from "lucide-react";
import { formatAmount } from "@/lib/helper";
import {
  CURRENT_NODE_CONFIG,
  NODE_TIERS,
  TIER_BENEFITS,
} from "@/lib/node-token";
import { BridgeHistory } from "@/services/BirdgeHistory";

interface BridgeTransaction {
  txHash: string;
  amount: string;
  status: "completed" | "pending";
  timeTaken: null;
}

export default function NodeDashboardPage() {
  const { address, isConnected } = useAccount();

  // Bridge analytics state
  const [bridgeData, setBridgeData] = useState<{
    totalAmount: string;
    totalTxns: number;
    txns: BridgeTransaction[];
  } | null>(null);

  console.log('bridgeData', bridgeData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    nodeData,
    loading: nodeLoading,
    isNodeHolder,
    hasAnalyticsAccess,
    hasAdvancedAnalyticsAccess,
  } = useNodeToken();

  // Fetch bridge analytics data using BridgeHistory
  useEffect(() => {
    if (address) {
      fetchBridgeAnalytics();
    }
  }, [address]);

  const fetchBridgeAnalytics = async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      // Get analytics from BridgeHistory for Sepolia chain (11155111)
      const analytics = await BridgeHistory.getBridgeAnalytics(11155111);

      const formattedData = {
        totalAmount: (Number(analytics.totalAmount) / 1e6).toFixed(2), // Convert from wei to readable format
        totalTxns: analytics.totalTxns,
        txns: analytics.txns.map((tx) => ({
          txHash: tx.txHash,
          amount: (Number(tx.amount) / 1e6).toFixed(2),
          status: (tx.status === 1 ? "completed" : "pending") as "completed" | "pending",
          timeTaken: null, // Not available in current structure
        })),
      };

      setBridgeData(formattedData);
    } catch (err) {
      console.error("Error fetching bridge analytics:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  // Use the fetched data or defaults
  const totalAmount = bridgeData?.totalAmount || "0";
  const totalTxns = bridgeData?.totalTxns || 0;
  const txns = bridgeData?.txns || [];

  const [activeTab, setActiveTab] = useState<
    "overview" | "analytics" | "benefits"
  >("overview");

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-12">
          <Crown className="mx-auto mb-4 text-white/40" size={64} />
          <h1 className="text-2xl font-bold mb-2">$NODE Token Dashboard</h1>
          <p className="text-white/60 mb-6">
            Connect your wallet to view your $NODE holdings and benefits
          </p>
          <div className="text-sm text-white/50">
            Connect wallet to get started
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="text-primary" size={32} />
          <h1 className="text-3xl font-bold">$NODE Token Dashboard</h1>
        </div>
        <p className="text-white/60 max-w-2xl mx-auto">
          Manage your $NODE holdings, track analytics, and discover exclusive
          benefits for token holders
        </p>
      </div>

      {/* NODE Status Overview */}
      <div className="grid gap-6 md:grid-cols-[1fr_auto]">
        <NodeStatusCard nodeData={nodeData} loading={nodeLoading} />
        {nodeData &&
          nodeData.tier !== "DIAMOND" &&
          nodeData.tier !== "NONE" && (
            <div className="md:w-80">
              <TierProgress
                currentBalance={nodeData.balance}
                currentTier={nodeData.tier}
              />
            </div>
          )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-black/30 rounded-xl2 w-fit mx-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === "overview"
              ? "bg-primary text-black"
              : "text-white/70 hover:text-white"
          }`}
        >
          <Crown size={16} />
          Overview
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === "analytics"
              ? "bg-primary text-black"
              : "text-white/70 hover:text-white"
          } ${!hasAnalyticsAccess ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={!hasAnalyticsAccess}
        >
          <BarChart3 size={16} />
          Analytics
          {!hasAnalyticsAccess && <Crown size={12} />}
        </button>
        <button
          onClick={() => setActiveTab("benefits")}
          className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === "benefits"
              ? "bg-primary text-black"
              : "text-white/70 hover:text-white"
          }`}
        >
          <Award size={16} />
          Benefits
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Token Information */}
          <div className="rounded-xl2 bg-card p-6 shadow-soft">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Info size={20} className="text-primary" />
              Token Information
            </h3>

            <div className="space-y-4">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-sm text-white/60 mb-1">
                  Contract Address
                </div>
                <div className="font-mono text-sm text-white/90 break-all">
                  {CURRENT_NODE_CONFIG.address}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-xs text-white/60 mb-1">Symbol</div>
                  <div className="font-semibold">
                    {CURRENT_NODE_CONFIG.symbol}
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="text-xs text-white/60 mb-1">Decimals</div>
                  <div className="font-semibold">
                    {CURRENT_NODE_CONFIG.decimals}
                  </div>
                </div>
              </div>

              {nodeData && (
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-sm text-white/60 mb-1">Your Balance</div>
                  <div className="text-2xl font-bold text-primary">
                    {formatAmount(
                      nodeData.balance,
                      CURRENT_NODE_CONFIG.decimals
                    )}{" "}
                    $NODE
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

          {/* Quick Stats */}
          <div className="rounded-xl2 bg-card p-6 shadow-soft">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              Quick Stats
            </h3>

            {hasAnalyticsAccess && totalTxns > 0 ? (
              <div className="space-y-4">
                {/* Loading indicator */}
                {loading && (
                  <div className="text-center text-xs text-white/60">
                    Loading bridge analytics...
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 relative">
                  <div className="bg-black/30 rounded-lg p-3 text-center">
                    <div className="text-xs text-white/60 mb-1">
                      Total Amount
                    </div>
                    <div className="text-lg font-semibold text-green-400">
                      ${totalAmount}
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-3 text-center">
                    <div className="text-xs text-white/60 mb-1">
                      Total Transactions
                    </div>
                    <div className="text-lg font-semibold text-blue-400">
                      {totalTxns}
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-3 text-center">
                    <div className="text-xs text-white/60 mb-1">
                      Total Bridges
                    </div>
                    <div className="text-lg font-semibold text-yellow-400">
                      {totalTxns}
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-3 text-center">
                    <div className="text-xs text-white/60 mb-1">
                      Current Tier
                    </div>
                    <div className="text-lg font-semibold text-purple-400">
                      {nodeData?.tier || "NONE"}
                    </div>
                  </div>
                </div>

                {/* Error display */}
                {error && (
                  <div className="text-xs text-red-400 bg-red-400/10 rounded p-2">
                    Error: {error}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="mx-auto mb-3 text-white/40" size={48} />
                <p className="text-white/60 text-sm mb-2">Analytics Locked</p>
                <p className="text-xs text-white/50">
                  Hold{" "}
                  {formatAmount(
                    NODE_TIERS.BRONZE,
                    CURRENT_NODE_CONFIG.decimals
                  )}{" "}
                  $NODE to unlock
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Bridge Analytics Overview */}
          {hasAnalyticsAccess && totalTxns > 0 && (
            <div className="rounded-xl2 bg-card p-6 shadow-soft">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity size={20} className="text-primary" />
                Live Bridge Analytics (Sepolia ↔ Base Sepolia)
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    ${totalAmount}
                  </div>
                  <div className="text-xs text-white/60">Total Volume</div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {totalTxns}
                  </div>
                  <div className="text-xs text-white/60">Transactions</div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {totalTxns}
                  </div>
                  <div className="text-xs text-white/60">Total Bridges</div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {txns.filter((t) => t.status === "completed").length}
                  </div>
                  <div className="text-xs text-white/60">Completed</div>
                </div>
              </div>

              {/* Recent Transactions */}
              {txns.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Recent Transactions
                  </h4>
                  <div className="bg-black/20 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-64 overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-black/30 sticky top-0">
                          <tr>
                            <th className="text-left p-3 text-white/60 font-medium">Transaction Hash</th>
                            <th className="text-right p-3 text-white/60 font-medium">Amount</th>
                            <th className="text-center p-3 text-white/60 font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {txns.slice(0, 10).map((txn, index) => (
                            <tr key={index} className="border-t border-white/10 hover:bg-black/20">
                              <td className="p-3">
                                <div className="font-mono text-white/80">
                                  {txn.txHash.slice(0, 5)}...{txn.txHash.slice(-5)}
                                </div>
                              </td>
                              <td className="p-3 text-right">
                                <div className="text-white/80 font-medium">${txn.amount}</div>
                              </td>
                              <td className="p-3 text-center">
                                <a
                                  href={`https://sepolia.etherscan.io/tx/${txn.txHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary/80 underline transition-colors"
                                >
                                  View Transaction
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
          )}

          <AnalyticsDashboard
            analytics={{
              totalBridged: totalAmount,
              bridgeCount: totalTxns,
              totalFeesSaved: "0", // Not available in BridgeHistory
              averageBridgeTime: "N/A", // Not available in BridgeHistory
              favoriteChains: [], // Not available in BridgeHistory
              lastBridgeDate: undefined, // Not available in BridgeHistory
            }}
            hasAccess={hasAnalyticsAccess}
            hasAdvancedAccess={hasAdvancedAnalyticsAccess}
          />
        </div>
      )}

      {activeTab === "benefits" && (
        <div className="space-y-6">
          {/* Current Benefits */}
          {nodeData && nodeData.tier !== "NONE" && (
            <div className="rounded-xl2 bg-card p-6 shadow-soft">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award size={20} className="text-primary" />
                Your Current Benefits ({nodeData.tier} Tier)
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                    <span className="flex items-center gap-2">
                      <DollarSign size={16} className="text-green-400" />
                      Fee Discount
                    </span>
                    <span className="font-semibold text-green-400">
                      {nodeData.benefits.feeDiscount}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                    <span className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-blue-400" />
                      Max Bridge Amount
                    </span>
                    <span className="font-semibold text-blue-400">
                      ${formatAmount(nodeData.benefits.maxBridgeAmount, 6)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                    <span className="flex items-center gap-2">
                      <BarChart3
                        size={16}
                        className={
                          nodeData.benefits.analytics
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      />
                      Analytics Access
                    </span>
                    <span
                      className={
                        nodeData.benefits.analytics
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {nodeData.benefits.analytics ? "✅" : "❌"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Tiers Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(TIER_BENEFITS)
              .filter(([tier]) => tier !== "NONE")
              .map(([tier, benefits]) => {
                const tierKey = tier as keyof typeof TIER_BENEFITS;
                const isCurrentTier = nodeData?.tier === tier;
                const tierThreshold =
                  NODE_TIERS[tierKey as keyof typeof NODE_TIERS];

                return (
                  <div
                    key={tier}
                    className={`rounded-xl2 bg-card p-4 shadow-soft border ${
                      isCurrentTier
                        ? "border-primary bg-primary/5"
                        : "border-white/10"
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
                      <p className="text-xs text-white/60">
                        {formatAmount(
                          tierThreshold,
                          CURRENT_NODE_CONFIG.decimals
                        )}{" "}
                        $NODE
                      </p>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Fee Discount:</span>
                        <span className="text-green-400">
                          {benefits.feeDiscount}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Bridge:</span>
                        <span className="text-blue-400">
                          ${formatAmount(benefits.maxBridgeAmount, 6)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Analytics:</span>
                        <span
                          className={
                            benefits.analytics
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {benefits.analytics ? "✅" : "❌"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Advanced:</span>
                        <span
                          className={
                            benefits.advancedAnalytics
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
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
                );
              })}
          </div>
        </div>
      )}

      {/* Call to Action for Non-Holders */}
      {(!nodeData || nodeData.tier === "NONE") && (
        <div className="rounded-xl2 bg-gradient-to-r from-primary/10 to-yellow-400/10 border border-primary/20 p-6 text-center">
          <Crown className="mx-auto mb-4 text-primary" size={48} />
          <h3 className="text-xl font-semibold mb-2">Unlock $NODE Benefits</h3>
          <p className="text-white/70 mb-4 max-w-2xl mx-auto">
            Hold $NODE tokens to unlock exclusive benefits including fee
            discounts, higher bridge limits, and priority
            features.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-green-400 font-medium">Up to 25%</div>
              <div className="text-white/60">Fee Discount</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-blue-400 font-medium">$500K</div>
              <div className="text-white/60">Max Bridge</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-purple-400 font-medium">Advanced</div>
              <div className="text-white/60">Analytics</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-yellow-400 font-medium">Priority</div>
              <div className="text-white/60">Support</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
