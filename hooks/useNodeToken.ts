// hooks/useNodeToken.ts
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { NodeTokenService, type NodeHolderData, type UserAnalytics } from "@/lib/node-service";

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

