"use client"

import { useAccount } from "wagmi"
import { useState, useEffect } from "react"
import { useNodeToken } from "@/hooks/useNodeToken"
import {
  NodeStatusCard,
  AnalyticsDashboard,
  TierProgress,
  BridgeTabNavigation,
  TokenInformation,
  QuickStats,
  BridgeAnalytics,
  BenefitsDisplay,
  WalletConnectPrompt,
  CallToAction
} from "@/components/dashboard"
import { BridgeHistory } from "@/services/BirdgeHistory"

interface BridgeTransaction {
  txHash: string
  amount: string
  status: "completed" | "pending"
  timeTaken: null
}

export default function NodeDashboardPage() {
  const { address, isConnected } = useAccount()

  // Bridge analytics state
  const [bridgeData, setBridgeData] = useState<{
    totalAmount: string
    totalTxns: number
    txns: BridgeTransaction[]
  } | null>(null)

  console.log("bridgeData", bridgeData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const {
    nodeData,
    loading: nodeLoading,
    hasAnalyticsAccess,
    hasAdvancedAnalyticsAccess,
  } = useNodeToken()

  // Fetch bridge analytics data using BridgeHistory
  useEffect(() => {
    if (address) {
      fetchBridgeAnalytics()
    }
  }, [address])

  const fetchBridgeAnalytics = async () => {
    if (!address) return

    setLoading(true)
    setError(null)

    try {
      // Get analytics from BridgeHistory for Sepolia chain (11155111)
      const analytics = await BridgeHistory.getBridgeAnalytics(11155111)

      const formattedData = {
        totalAmount: (Number(analytics.totalAmount) / 1e6).toFixed(2), // Convert from wei to readable format
        totalTxns: analytics.totalTxns,
        txns: analytics.txns.map((tx) => ({
          txHash: tx.txHash,
          amount: (Number(tx.amount) / 1e6).toFixed(2),
          status: (tx.status === 1 ? "completed" : "pending") as "completed" | "pending",
          timeTaken: null, // Not available in current structure
        })),
      }

      setBridgeData(formattedData)
    } catch (err) {
      console.error("Error fetching bridge analytics:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch analytics")
    } finally {
      setLoading(false)
    }
  }

  // Use the fetched data or defaults
  const totalAmount = bridgeData?.totalAmount || "0"
  const totalTxns = bridgeData?.totalTxns || 0
  const txns = bridgeData?.txns || []

  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "benefits">("overview")

  if (!isConnected) {
    return <WalletConnectPrompt />
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        <BridgeTabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasAnalyticsAccess={hasAnalyticsAccess}
        />

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <NodeStatusCard nodeData={nodeData} loading={nodeLoading} />
              {nodeData && nodeData.tier !== "DIAMOND" && nodeData.tier !== "NONE" && (
                <TierProgress currentBalance={nodeData.balance} currentTier={nodeData.tier} />
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <TokenInformation nodeData={nodeData} />
              <QuickStats
                hasAnalyticsAccess={hasAnalyticsAccess}
                totalAmount={totalAmount}
                totalTxns={totalTxns}
                nodeData={nodeData}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <BridgeAnalytics
              hasAnalyticsAccess={hasAnalyticsAccess}
              totalAmount={totalAmount}
              totalTxns={totalTxns}
              txns={txns}
            />
            <AnalyticsDashboard
              analytics={{
                totalBridged: totalAmount,
                bridgeCount: totalTxns,
                totalFeesSaved: "0",
                averageBridgeTime: "N/A",
                favoriteChains: [],
                lastBridgeDate: undefined,
              }}
              hasAccess={hasAnalyticsAccess}
              hasAdvancedAccess={hasAdvancedAnalyticsAccess}
            />
          </div>
        )}

        {activeTab === "benefits" && (
          <BenefitsDisplay nodeData={nodeData} />
        )}

        {/* Call to Action for Non-Holders */}
        {(!nodeData || nodeData.tier === "NONE") && (
          <CallToAction />
        )}
      </div>
    </div>
  )
}
