"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, Loader2, AlertCircle } from "lucide-react";

export type BridgeStatus =
  | "idle"
  | "initializing"
  | "approving"
  | "approved"
  | "bridging"
  | "waiting_confirmation"
  | "extracting_hash"
  | "completed"
  | "failed";

interface StatusStep {
  id: BridgeStatus;
  label: string;
  description: string;
}

const BRIDGE_STEPS: StatusStep[] = [
  {
    id: "initializing",
    label: "Initializing Bridge",
    description: "Preparing bridge transaction"
  },
  {
    id: "approving",
    label: "Approving USDC",
    description: "Authorizing the bridge contract to spend your USDC tokens"
  },
  {
    id: "approved",
    label: "Approval Confirmed",
    description: "USDC spending authorization confirmed on blockchain"
  },
  {
    id: "bridging",
    label: "Initiating Bridge",
    description: "Calling depositForBurn to start the cross-chain transfer"
  },
  {
    id: "waiting_confirmation",
    label: "Waiting for Confirmation",
    description: "Waiting for transaction to be confirmed on source chain"
  },
  {
    id: "extracting_hash",
    label: "Processing Message",
    description: "Extracting message hash from transaction logs"
  },
  {
    id: "completed",
    label: "Bridge Submitted",
    description: "Bridge transaction submitted successfully. Tokens will arrive shortly."
  }
];

interface StatusIndicatorProps {
  currentStatus: BridgeStatus;
  error?: string;
}

export function StatusIndicator({ currentStatus, error }: StatusIndicatorProps) {
  const [visibleSteps, setVisibleSteps] = useState<BridgeStatus[]>([]);

  useEffect(() => {
    if (currentStatus === "idle" || currentStatus === "failed") {
      setVisibleSteps([]);
      return;
    }

    const currentIndex = BRIDGE_STEPS.findIndex(step => step.id === currentStatus);
    if (currentIndex >= 0) {
      const steps = BRIDGE_STEPS.slice(0, currentIndex + 1).map(step => step.id);
      setVisibleSteps(steps);
    }
  }, [currentStatus]);

  if (currentStatus === "idle") {
    return null;
  }

  if (error) {
    return (
      <div className="rounded-xl2 border border-red-500/20 bg-red-500/10 p-4 mb-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
          <div>
            <p className="text-red-400 font-medium">Bridge Failed</p>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl2 border border-white/10 bg-black/30 p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <h4 className="font-medium text-white">Bridge Processing</h4>
      </div>

      <div className="space-y-3">
        {BRIDGE_STEPS.map((step) => {
          const isVisible = visibleSteps.includes(step.id);
          const isCurrent = step.id === currentStatus;
          const isCompleted = visibleSteps.includes(step.id) && !isCurrent;

          if (!isVisible) return null;

          return (
            <div key={step.id} className="flex items-start gap-3">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 mt-0.5 flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="text-green-400" size={14} />
                ) : isCurrent ? (
                  <Loader2 className="text-primary animate-spin" size={12} />
                ) : (
                  <Clock className="text-white/40" size={12} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${
                  isCurrent ? "text-primary" :
                  isCompleted ? "text-green-400" : "text-white/60"
                }`}>
                  {step.label}
                </p>
                <p className={`text-xs mt-1 ${
                  isCurrent ? "text-white/80" :
                  isCompleted ? "text-white/60" : "text-white/40"
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}