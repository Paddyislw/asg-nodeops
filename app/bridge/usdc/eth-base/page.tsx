"use client";

import { useAccount, useChainId } from "wagmi";
import { useState } from "react";
import { BRIDGE_CHAINS } from "@/lib/constants";
import { TOKENS } from "@/lib/constants";
import { useReadContract } from "wagmi";
import type { Address } from "viem";
import { formatAmount } from "@/lib/helper";
import { CheckCircle2, Activity, X, AlertTriangle } from "lucide-react";
import { HistoryList } from "@/components/bridge/HistoryList";
import { TokenPicker } from "@/components/bridge/TokenPicker";
import { NextBtn } from "@/components/bridge/NextBtn";
import { ChainPicker } from "@/components/bridge/ChainPicker";
import { WizardHeader } from "@/components/bridge/WizardHeader";
import { ReviewCard } from "@/components/bridge/ReviewCard";
import { AmountInput } from "@/components/bridge/AmountInput";
import {
  StatusIndicator,
  type BridgeStatus,
} from "@/components/bridge/StatusIndicator";
import { useBridgeHistory } from "@/hooks/useBridgeHistory";
import { ERC20_ABI } from "@/abi/bridge-abi";
import { BackBtn } from "@/components/bridge/BackBtn";


export default function BridgePage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const [showStatusModal, setShowStatusModal] = useState(false);

  // Check if user is on the correct chain for bridging
  const isOnCorrectChain = chainId === BRIDGE_CHAINS.sepolia.id;
  const canUseBridge = isConnected && isOnCorrectChain;

  // Create status callback to update the UI
  const onStatusUpdate = (status: string, description?: string) => {
    setBridgeStatus(status as BridgeStatus);
    console.log(`🔄 Bridge Status: ${status} - ${description || ""}`);
  };

  const { history, isLoadingHistory, executeBridge } =
    useBridgeHistory(onStatusUpdate);

  const [step, setStep] = useState(1);
  const fromChainId = BRIDGE_CHAINS.sepolia.id;
  const toChainId = BRIDGE_CHAINS.baseSepolia.id;

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


  function reset() {
    setStep(1);
    setAmount("");
    setToken(TOKENS[fromChainId]?.[0]?.address as Address);
    setBridgeStatus("idle");
    setError("");
    setIsProcessing(false);
    setShowStatusModal(false);
  }

  async function handleExecuteBridge() {
    if (!address || !token) return;

    setIsProcessing(true);
    setError("");
    setBridgeStatus("initializing");
    setShowStatusModal(true);

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
      setShowStatusModal(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Bridge failed:", err);
      setError(errorMessage || "Bridge transaction failed");
      setBridgeStatus("failed");
    } finally {
      setIsProcessing(false);
    }
  }


  // Wrong Network Warning Component
  const WrongNetworkWarning = () => (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="text-red-400 w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-red-400 mb-2">
        Wrong Network Detected
      </h3>
      <p className="text-red-200/80 text-sm leading-relaxed mb-4">
        Currently we support USDC bridging from <strong>Ethereum Sepolia</strong> to <strong>Base Sepolia</strong> only.
        Please switch to Ethereum Sepolia network to use the bridge.
      </p>
      <div className="text-xs text-red-300/70">
        Current Network: {chainId === 1 ? 'Ethereum Mainnet' : chainId === 84532 ? 'Base Sepolia' : `Chain ${chainId}`}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Bridge Card */}
          <div
            className={`rounded-xl border transition-all duration-200 border-border shadow-lg ${
              canUseBridge
                ? "cursor-pointer bg-card/50 hover:bg-card/80"
                : "bg-card/30 opacity-75"
            }`}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-3 h-3 rounded-full ${canUseBridge ? "bg-primary" : "bg-red-500"}`}></div>
                <h2 className="text-xl font-semibold text-foreground">
                  Bridge Tokens
                </h2>
              </div>

              {!canUseBridge ? (
                <WrongNetworkWarning />
              ) : (

              <div className="space-y-6 flex-1 flex flex-col">
                <WizardHeader step={step} />

                {/* Step 1 - Chain Selection */}
                {step === 1 && (
                  <div className="space-y-6 flex-1 flex flex-col">
                    <ChainPicker
                      label="From"
                      type="from"
                    />
                    <ChainPicker
                      label="To"
                      type="to"
                    />


                    <div className="flex gap-4 pt-4 flex-1 items-end justify-end">
                      <NextBtn
                        enabled={isConnected}
                        onClick={() => setStep(2)}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2 - Token and Amount */}
                {step === 2 && (
                  <div className="space-y-6 flex-1 flex flex-col">
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
                    <div className="flex gap-4 pt-4 flex-1 items-end justify-end">
                      <BackBtn onClick={() => setStep(1)} />
                      <NextBtn
                        enabled={!!amount && Number(amount) > 0}
                        onClick={() => setStep(3)}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3 - Review and Execute */}
                {step === 3 && (
                  <div className="space-y-6 flex-1 flex flex-col">
                    <ReviewCard
                      fromChainId={fromChainId}
                      toChainId={toChainId}
                      token={token!}
                      amount={amount}
                    />

                    {(isProcessing || bridgeStatus !== "idle") && (
                      <button
                        onClick={() => setShowStatusModal(true)}
                        className="w-full rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-accent hover:bg-accent/20 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Activity className="w-4 h-4" />
                        Show Current Status of Txn
                      </button>
                    )}

                    <div
                      className={`flex gap-4  flex-1 items-end justify-end pt-4 ${isProcessing ? "" : ""}`}
                    >
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
                        className={`group ${
                          isProcessing ? "w-full" : "flex-1"
                        } rounded-lg px-6 py-3.5 font-semibold text-sm transition-all duration-200 ${
                          isProcessing
                            ? "bg-muted/20 text-muted-foreground cursor-not-allowed"
                            : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
                        }`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          {isProcessing ? (
                            <>
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              Bridge Tokens
                              <svg
                                className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                              </svg>
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4 - Success */}
                {step === 4 && (
                  <div className="space-y-6 flex-1 flex flex-col">
                    <div className="rounded-lg border border-chart-1/30 bg-chart-1/10 p-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-chart-1/20 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="text-chart-1 w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Bridge Submitted Successfully!
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Your tokens are being bridged. The transaction will be
                        processed automatically and your tokens will arrive
                        shortly on the destination network.
                      </p>
                    </div>

                    {/* Status Update Warning - Only show while monitoring */}
                    {history.length > 0 && history[0].status === "pending" && (
                      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin flex-shrink-0 mt-0.5"></div>
                          <div>
                            <h4 className="text-sm font-medium text-yellow-400 mb-1">
                              Monitoring Transaction Status
                            </h4>
                            <p className="text-yellow-200/80 text-xs leading-relaxed">
                              Please don't close or reload this page. When your transaction completes,
                              you'll be prompted for one more wallet confirmation to update the status.
                              This ensures accurate tracking in your history.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={reset}
                      className=" w-full rounded-lg border border-border py-3 text-sm font-medium transition-all duration-200 hover:bg-accent/10 hover:border-accent/50 active:scale-[0.98]"
                    >
                      Start New Bridge
                    </button>
                  </div>
                )}
              </div>
              )}
            </div>
          </div>

          {/* History Card */}
          <div
            className={`rounded-xl border transition-all duration-200 cursor-pointer border-border bg-card/50 hover:bg-card/80 shadow-lg `}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <h2 className="text-xl font-semibold text-foreground">
                  Bridge History
                </h2>
              </div>

              <HistoryList items={history} isLoading={isLoadingHistory} />
            </div>
          </div>
        </div>
      </div>

      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Transaction Status
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-2 rounded-lg hover:bg-muted/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <StatusIndicator currentStatus={bridgeStatus} error={error} />

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium transition-all duration-200 hover:bg-muted/20"
              >
                Close
              </button>
              {bridgeStatus === "completed" && (
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    reset();
                  }}
                  className="flex-1 rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-medium transition-all duration-200 hover:bg-primary/90"
                >
                  New Bridge
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
