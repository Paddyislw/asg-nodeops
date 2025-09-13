// hooks/useNodeToken.ts
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { NodeTokenService, type NodeHolderData, type UserAnalytics } from "@/lib/node-service";
import { type Address } from "viem";

export function useNodeToken() {
  const { address } = useAccount();
  const [nodeData, setNodeData] = useState<NodeHolderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setNodeData(null);
      return;
    }

    const fetchNodeData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await NodeTokenService.getNodeHolderData(address);
        console.log('Node Data',data)
        setNodeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch NODE data");
      } finally {
        setLoading(false);
      }
    };

    fetchNodeData();
  }, [address]);

  const refetch = async () => {
    if (address) {
      setLoading(true);
      try {
        const data = await NodeTokenService.getNodeHolderData(address);
        setNodeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch NODE data");
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    nodeData,
    loading,
    error,
    refetch,
    isNodeHolder: nodeData ? nodeData.tier !== "NONE" : false,
    hasAnalyticsAccess: nodeData?.benefits.analytics || false,
    hasAdvancedAnalyticsAccess: nodeData?.benefits.advancedAnalytics || false,
  };
}

export function useUserAnalytics() {
  const { address } = useAccount();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);

  useEffect(() => {
    if (!address) {
      setAnalytics(null);
      return;
    }

    const data = NodeTokenService.getUserAnalytics(address);
    setAnalytics(data);
  }, [address]);

  const updateAnalytics = (
    bridgeAmount: string,
    fromChain: number,
    toChain: number,
    feesSaved: string
  ) => {
    if (address) {
      NodeTokenService.updateUserAnalytics(address, bridgeAmount, fromChain, toChain, feesSaved);
      const updated = NodeTokenService.getUserAnalytics(address);
      setAnalytics(updated);
    }
  };

  return {
    analytics,
    updateAnalytics,
  };
}