"use client"

import { Crown, BarChart3, Award } from "lucide-react"

interface BridgeTabNavigationProps {
  activeTab: "overview" | "analytics" | "benefits"
  setActiveTab: (tab: "overview" | "analytics" | "benefits") => void
  hasAnalyticsAccess: boolean
}

export function BridgeTabNavigation({ activeTab, setActiveTab, hasAnalyticsAccess }: BridgeTabNavigationProps) {
  return (
    <div className="flex justify-center w-full px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row gap-1 p-1 bg-muted rounded-lg w-full sm:w-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3 sm:px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === "overview"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Crown size={16} />
          <span className="sm:inline">Overview</span>
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-3 sm:px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === "analytics"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          } ${!hasAnalyticsAccess ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={!hasAnalyticsAccess}
        >
          <BarChart3 size={16} />
          <span className="sm:inline">Analytics</span>
          {!hasAnalyticsAccess && <Crown size={12} />}
        </button>
        <button
          onClick={() => setActiveTab("benefits")}
          className={`px-3 sm:px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === "benefits"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award size={16} />
          <span className="sm:inline">Benefits</span>
        </button>
      </div>
    </div>
  )
}