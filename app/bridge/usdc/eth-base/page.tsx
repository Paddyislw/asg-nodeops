"use client";

import { useAccount } from "wagmi";
import { useState } from "react";
import { BRIDGE_CHAINS } from "@/lib/constants";
import { TOKENS } from "@/lib/constants";
import { useReadContract } from "wagmi";
import type { Address } from "viem";
import { formatAmount } from "@/lib/helper";
import { ArrowRightLeft, CheckCircle2 } from "lucide-react";
import { HistoryList } from "@/components/bridge/HistoryList";
import { TokenPicker } from "@/components/bridge/TokenPicker";
import { NextBtn } from "@/components/bridge/NextBtn";
import { BackBtn } from "@/components/bridge/BackBtn";
import { ChainPicker } from "@/components/bridge/ChainPicker";
import { WizardHeader } from "@/components/bridge/WizardHeader";
import { ReviewCard } from "@/components/bridge/ReviewCard";
import { AmountInput } from "@/components/bridge/AmountInput";
import { StatusIndicator, type BridgeStatus } from "@/components/bridge/StatusIndicator";
import { useBridgeHistory } from "@/hooks/useBridgeHistory";
import { ERC20_ABI } from "@/abi/bridge-abi";

const CHAINS = Object.values(BRIDGE_CHAINS);

export default function BridgePage() {
  const { address, isConnected } = useAccount();

  // Create status callback to update the UI
  const onStatusUpdate = (status: string, description?: string) => {
    setBridgeStatus(status as BridgeStatus);
    console.log(`🔄 Bridge Status: ${status} - ${description || ''}`);
  };

  const { history, isLoadingHistory, executeBridge } = useBridgeHistory(onStatusUpdate);

  const [step, setStep] = useState(1);
  const [fromChainId, setFrom] = useState(CHAINS[0].id);
  const [toChainId, setTo] = useState(CHAINS[1].id);

  const tokensOnFrom = TOKENS[fromChainId] || [];
  const [token, setToken] = useState(
    tokensOnFrom[0]?.address as Address | undefined
  );
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [bridgeStatus, setBridgeStatus] = useState<BridgeStatus>("idle");

  // balance read
  const { data: balanceRaw } = useReadContract({
    abi: ERC20_ABI,
    address: token,
    functionName: "balanceOf",
    args: [address as Address],
    chainId: fromChainId,
    query: { enabled: Boolean(address && token) },
  });


  const decimals = tokensOnFrom.find((t) => t.address === token)?.decimals ?? 6;
  const balance = balanceRaw
    ? formatAmount(balanceRaw as bigint, decimals)
    : "0";

  function swapChains() {
    setFrom(toChainId);
    setTo(fromChainId);
    setToken(undefined);
  }

  function reset() {
    setStep(1);
    setAmount("");
    setToken(TOKENS[fromChainId]?.[0]?.address as Address);
    setBridgeStatus("idle");
    setError("");
    setIsProcessing(false);
  }

  async function handleExecuteBridge() {
    if (!address || !token) return;

    setIsProcessing(true);
    setError("");
    setBridgeStatus("initializing");

    try {
      const tokenInfo = TOKENS[fromChainId]?.find((t) => t.address === token);
      if (!tokenInfo) throw new Error("Token not found");

      await executeBridge(
        fromChainId,
        toChainId,
        token,
        amount,
        tokenInfo.decimals
      );

      setBridgeStatus("completed");
      setStep(4);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Bridge failed:", err);
      setError(errorMessage || "Bridge transaction failed");
      setBridgeStatus("failed");
    } finally {
      setIsProcessing(false);
    }
  }



  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-xl2 bg-card p-5 shadow-soft">
        <WizardHeader step={step} />
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <ChainPicker
              label="From"
              value={fromChainId}
              onChange={(v) => {
                setFrom(v as typeof fromChainId);
                setToken(TOKENS[v]?.[0]?.address as Address);
              }}
            />
            <ChainPicker
              label="To"
              value={toChainId}
              onChange={(v) => setTo(v as typeof toChainId)}
              exclude={fromChainId}
            />
            <button
              onClick={swapChains}
              className="w-full rounded-xl2 border border-white/10 bg-transparent py-2 text-sm hover:bg-white/5"
            >
              <div className="flex items-center justify-center gap-2">
                <ArrowRightLeft size={16} /> Swap
              </div>
            </button>
            <div className="pt-2">
              <NextBtn
                enabled={isConnected && fromChainId !== toChainId}
                onClick={() => setStep(2)}
              />
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <TokenPicker
              chainId={fromChainId}
              value={token}
              onChange={setToken}
            />
            <AmountInput
              value={amount}
              onChange={setAmount}
              balance={balance}
              onMax={() => setAmount(balance)}
            />
            <div className="flex gap-3">
              <BackBtn onClick={() => setStep(1)} />
              <NextBtn
                enabled={!!amount && Number(amount) > 0}
                onClick={() => setStep(3)}
              />
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <ReviewCard
              fromChainId={fromChainId}
              toChainId={toChainId}
              token={token!}
              amount={amount}
            />

            {/* Status Indicator */}
            <StatusIndicator
              currentStatus={bridgeStatus}
              error={error}
            />

            <div className={`flex gap-3 ${isProcessing ? "" : ""}`}>
              {!isProcessing && (
                <BackBtn
                  onClick={() => {
                    setStep(2);
                    setBridgeStatus("idle");
                    setError("");
                  }}
                />
              )}
              <button
                onClick={handleExecuteBridge}
                disabled={isProcessing}
                className={`${isProcessing ? "w-full" : "flex-1"} rounded-xl2 px-4 py-3 font-semibold ${
                  isProcessing
                    ? "bg-white/10 text-white/40 cursor-not-allowed"
                    : "bg-primary text-black hover:opacity-90"
                }`}
              >
                {isProcessing ? "Processing..." : "Bridge Tokens"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="rounded-xl2 border border-white/10 bg-black/30 p-4">
              <p className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="text-primary" /> Bridge Submitted
              </p>
              <p className="text-white/70 text-sm mt-1">
                Your tokens are being bridged. The status will update
                automatically when the bridge completes.
              </p>
            </div>
            <button
              onClick={reset}
              className="w-full rounded-xl2 border border-white/10 py-2 text-sm hover:bg-white/5"
            >
              New Bridge
            </button>
          </div>
        )}
      </div>

      <div className="rounded-xl2 bg-card p-5 shadow-soft">
        <h3 className="mb-2 text-sm font-medium text-white/70">
          Bridge History
        </h3>
        <HistoryList items={history} isLoading={isLoadingHistory} />
      </div>
    </div>
  );
}

