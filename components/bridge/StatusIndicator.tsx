"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Clock, Loader2, AlertCircle } from "lucide-react"

export type BridgeStatus =
  | "idle"
  | "initializing"
  | "approving"
  | "approved"
  | "bridging"
  | "waiting_confirmation"
  | "extracting_hash"
  | "completed"
  | "failed"

interface StatusStep {
  id: BridgeStatus
  label: string
  description: string
}

const BRIDGE_STEPS: StatusStep[] = [
  {
    id: "initializing",
    label: "Initializing Bridge",
    description: "Preparing bridge transaction",
  },
  {
    id: "approving",
    label: "Approving USDC",
    description: "Authorizing the bridge contract to spend your USDC tokens",
  },
  {
    id: "approved",
    label: "Approval Confirmed",
    description: "USDC spending authorization confirmed on blockchain",
  },
  {
    id: "bridging",
    label: "Initiating Bridge",
    description: "Calling depositForBurn to start the cross-chain transfer",
  },
  {
    id: "waiting_confirmation",
    label: "Waiting for Confirmation",
    description: "Waiting for transaction to be confirmed on source chain",
  },
  {
    id: "extracting_hash",
    label: "Processing Message",
    description: "Extracting message hash from transaction logs",
  },
  {
    id: "completed",
    label: "Bridge Submitted",
    description: "Bridge transaction submitted successfully. Tokens will arrive shortly.",
  },
]

interface StatusIndicatorProps {
  currentStatus: BridgeStatus
  error?: string
}

export function StatusIndicator({ currentStatus, error }: StatusIndicatorProps) {
  const [visibleSteps, setVisibleSteps] = useState<BridgeStatus[]>([])

  useEffect(() => {
    if (currentStatus === "idle" || currentStatus === "failed") {
      setVisibleSteps([])
      return
    }

    const currentIndex = BRIDGE_STEPS.findIndex((step) => step.id === currentStatus)
    if (currentIndex >= 0) {
      const steps = BRIDGE_STEPS.slice(0, currentIndex + 1).map((step) => step.id)
      setVisibleSteps(steps)
    }
  }, [currentStatus])

  if (currentStatus === "idle") {
    return null
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
            <AlertCircle className="text-destructive w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-destructive font-semibold text-sm">Bridge Failed</h4>
            <p className="text-destructive/80 text-sm mt-1 leading-relaxed">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 mb-4">
      <div className="flex items-center gap-3 mb-6">
        <h4 className="font-semibold text-foreground">Bridge Processing</h4>
      </div>

      <div className="space-y-4">
        {BRIDGE_STEPS.map((step, index) => {
          const isVisible = visibleSteps.includes(step.id)
          const isCurrent = step.id === currentStatus
          const isCompleted = visibleSteps.includes(step.id) && !isCurrent

          if (!isVisible) return null

          return (
            <div key={step.id} className="flex items-start gap-4 relative">
              {/* Connection line */}
              {index < BRIDGE_STEPS.length - 1 && isVisible && (
                <div className="absolute left-4 top-8 w-0.5 h-6 bg-border"></div>
              )}

              {/* Step indicator */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-primary border-primary shadow-lg shadow-primary/25"
                    : isCurrent
                      ? "border-primary bg-background shadow-lg shadow-primary/10"
                      : "border-border bg-card"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="text-primary-foreground w-4 h-4" />
                ) : isCurrent ? (
                  <Loader2 className="text-primary w-3 h-3 animate-spin" />
                ) : (
                  <Clock className="text-muted-foreground w-3 h-3" />
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 pb-2">
                <p
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </p>
                <p
                  className={`text-xs mt-1 leading-relaxed transition-colors duration-200 ${
                    isCurrent
                      ? "text-muted-foreground"
                      : isCompleted
                        ? "text-muted-foreground/80"
                        : "text-muted-foreground/60"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
