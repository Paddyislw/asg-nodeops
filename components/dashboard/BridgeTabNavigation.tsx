"use client"

import { Crown, BarChart3, Award } from "lucide-react"

interface BridgeTabNavigationProps {
  activeTab: "overview" | "analytics" | "benefits"
  setActiveTab: (tab: "overview" | "analytics" | "benefits") => void
  hasAnalyticsAccess: boolean
}

export function BridgeTabNavigation({ activeTab, setActiveTab, hasAnalyticsAccess }: BridgeTabNavigationProps) {
  return (
    <div className="flex justify-center">
      <div className="flex gap-1 p-1 bg-muted rounded-lg">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "overview"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Crown size={16} />
          Overview
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "analytics"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          } ${!hasAnalyticsAccess ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={!hasAnalyticsAccess}
        >
          <BarChart3 size={16} />
          Analytics
          {!hasAnalyticsAccess && <Crown size={12} />}
        </button>
        <button
          onClick={() => setActiveTab("benefits")}
          className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "benefits"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award size={16} />
          Benefits
        </button>
      </div>
    </div>
  )
}