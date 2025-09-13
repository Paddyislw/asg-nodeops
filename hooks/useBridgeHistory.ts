import { useState, useEffect, Dispatch, SetStateAction } from "react";
import type { Address } from "viem";
import { useAccount } from "wagmi";
import { getStatusText } from "@/lib/helper";
import { BridgeHistory } from "@/services/BirdgeHistory";
import { BridgeManager } from "@/services/BridgeManager";
import { BridgeService, BridgeStatusCallback } from "@/services/BridgeService";
import { BridgeRecord, BridgeResult } from "@/types/bridge";

export function useBridgeHistory(onStatusUpdate?: BridgeStatusCallback) {
  const { address } = useAccount();
  const [history, setHistory] = useState<BridgeRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // useEffect(() => {
  //   if (address) {
  //     async function fetchBridges() {
  //       const data1 = await SimpleBridgeTracker.getUserBridges(
  //         11155111,
  //         address as Address
  //       );

  //       const data2 = await SimpleBridgeTracker.getGlobalAnalyticsSummary(
  //         11155111
  //       );
  //       const data3 = await SimpleBridgeTracker.getAllUsers(11155111);
  //       const data4 = await SimpleBridgeTracker.getTotalUsers(11155111);

  //       console.log("User Bridge Data:", { data1, data2, data3, data4 });
  //     }
  //     fetchBridges();
  //   }
  // }, [address, isConnected]);

  useEffect(() => {
    if (address) {
      async function fetchHistory() {
        setIsLoadingHistory(true);

        const rawData = await BridgeHistory.getUserBridges(
          11155111,
          address as Address
        );

        if (rawData && Array.isArray(rawData) && address) {
          const convertedHistory: BridgeRecord[] = rawData.map((rawItem) => ({
            id: rawItem.messageHash,
            ts: Number(rawItem.timestamp) * 1000,
            fromChainId: rawItem.fromChain,
            toChainId: rawItem.toChain,
            token: rawItem.token,
            amount: (Number(rawItem.amount) / Math.pow(10, 6)).toString(),
            status: "pending",
          }));

        

          const statusPromises = convertedHistory.map((record) =>
            monitorBridgeStatusInitial(record)
          );

          Promise.all(statusPromises).then((checkedRecords) => {
            setHistory(checkedRecords);
            setIsLoadingHistory(false);
          });
        } else {
          setIsLoadingHistory(false);
        }
      }
      fetchHistory();
    }
  }, [address]);

  async function monitorBridgeStatusInitial(
    record: BridgeRecord
  ): Promise<BridgeRecord> {
    return new Promise(async (resolve) => {
      try {
        const status = await BridgeService.getBridgeStatus(record.id);
        const newStatus = getStatusText(status);
        const updatedRecord = { ...record, status: newStatus };

        if (newStatus === "pending") {
          monitorBridgeStatus(record.id);
        }

        resolve(updatedRecord);
      } catch (error) {
        console.error("Initial status check failed:", error);
        resolve(record);
        monitorBridgeStatus(record.id);
      }
    });
  }

  async function monitorBridgeStatus(messageHash: string) {
    const maxAttempts = 30;
    let attempts = 0;

    const checkStatus = async () => {
      try {
        const status = await BridgeService.getBridgeStatus(messageHash);
        const newStatus = getStatusText(status);

        if (newStatus !== "pending") {
          setHistory((prevHistory) => {
            const updatedItems = prevHistory.map((it) =>
              it.id === messageHash ? { ...it, status: newStatus } : it
            );
            return updatedItems;
          });
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 10000);
        }
      } catch (error) {
        console.error("Status check failed:", error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 10000);
        }
      }
    };

    setTimeout(checkStatus, 5000);
  }

  async function executeBridge(
    fromChainId: number,
    toChainId: number,
    token: Address,
    amount: string,
    tokenDecimals: number
  ) {
    if (!address || !token) return null;

    console.log("🚀 Starting bridge with contract recording...");

    const bridgeParams = {
      fromChainId,
      toChainId,
      token,
      amount,
      recipient: address,
      decimals: tokenDecimals,
    };

    // Use BridgeService directly with status callback
    const result = await BridgeService.initiateBridge(bridgeParams, onStatusUpdate);

    // Record in contract using BridgeManager
    try {
      await BridgeManager.recordExistingBridge(
        fromChainId,
        bridgeParams,
        result,
        address
      );
      console.log("✅ Bridge recorded in contract successfully");
    } catch (error) {
      console.warn("⚠️ Failed to record in contract, but bridge was successful:", error);
    }

    console.log("✅ Bridge initiated:", result);

    const rec: BridgeRecord = {
      id: result.bridgeId,
      ts: Date.now(),
      fromChainId,
      toChainId,
      token,
      amount,
      status: "pending",
    };

    const items = [rec, ...history];
    setHistory(items);

    monitorBridgeStatus(result.bridgeId);

    return result;
  }

  return {
    history,
    isLoadingHistory,
    executeBridge,
    monitorBridgeStatus,
    monitorBridgeStatusInitial,
    setHistory,
  } as {
    history: BridgeRecord[];
    isLoadingHistory: boolean;
    executeBridge: (fromChainId: number, toChainId: number, token: Address, amount: string, tokenDecimals: number) => Promise<BridgeResult | null>;
    monitorBridgeStatus: (messageHash: string) => Promise<void>;
    monitorBridgeStatusInitial: (record: BridgeRecord) => Promise<BridgeRecord>;
    setHistory: Dispatch<SetStateAction<BridgeRecord[]>>;
  };
}
