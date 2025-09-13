"use client"

import { Crown } from "lucide-react"

export function WalletConnectPrompt() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-20">
          <Crown className="mx-auto mb-6 text-muted-foreground" size={64} />
          <h1 className="text-3xl font-bold mb-4 text-foreground">$NODE Token Dashboard</h1>
          <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
            Connect your wallet to view your $NODE holdings and benefits
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            Connect wallet to get started
          </div>
        </div>
      </div>
    </div>
  )
}