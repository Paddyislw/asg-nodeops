"use client"

import { Crown } from "lucide-react"

export function CallToAction() {
  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
      <Crown className="mx-auto mb-4 text-primary" size={48} />
      <h3 className="text-xl font-semibold mb-2">Unlock $NODE Benefits</h3>
      <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
        Hold $NODE tokens to unlock exclusive benefits including fee discounts, higher bridge limits, and priority
        features.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-muted rounded-lg p-3">
          <div className="text-primary font-medium">Up to 25%</div>
          <div className="text-muted-foreground">Fee Discount</div>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <div className="text-primary font-medium">$500K</div>
          <div className="text-muted-foreground">Max Bridge</div>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <div className="text-primary font-medium">Advanced</div>
          <div className="text-muted-foreground">Analytics</div>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <div className="text-primary font-medium">Priority</div>
          <div className="text-muted-foreground">Support</div>
        </div>
      </div>
    </div>
  )
}