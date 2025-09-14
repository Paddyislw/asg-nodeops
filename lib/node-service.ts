// lib/node-service.ts
import { type Address } from "viem";
import { readContract } from "wagmi/actions";
import { config } from "./wagmi";
import { 
  CURRENT_NODE_CONFIG, 
  NODE_TIERS, 
  TIER_BENEFITS, 
  type NodeTier 
} from "./node-token";
import { ERC20_ABI } from "@/abi/bridge-abi";

export interface NodeHolderData {
  balance: bigint;
  tier: NodeTier;
  benefits: typeof TIER_BENEFITS[NodeTier];
}

export interface UserAnalytics {
  totalBridged: string;
  bridgeCount: number;
  favoriteChains: { fromChain: number; toChain: number; count: number }[];
  totalFeesSaved: string;
  averageBridgeTime: string;
  lastBridgeDate?: Date;
}

export class NodeTokenService {
  /**
   * Get NODE token balance for a user
   */
  static async getNodeBalance(userAddress: Address): Promise<bigint> {
    try {
      const balance = await readContract(config, {
        abi: ERC20_ABI,
        address: CURRENT_NODE_CONFIG.address,
        functionName: "balanceOf",
        args: [userAddress],
        chainId: 1, // Ethereum mainnet
      });
      
      return balance as bigint;
    } catch (error) {
      console.error("Failed to fetch NODE balance:", error);
      return BigInt(0);
    }
  }

  /**
   * Determine user's NODE tier based on balance
   */
  static getNodeTier(balance: bigint): NodeTier {
    if (balance >= NODE_TIERS.DIAMOND) return "DIAMOND";
    if (balance >= NODE_TIERS.GOLD) return "GOLD";
    if (balance >= NODE_TIERS.SILVER) return "SILVER";
    if (balance >= NODE_TIERS.BRONZE) return "BRONZE";
    return "NONE";
  }

  /**
   * Get complete NODE holder data
   */
  static async getNodeHolderData(userAddress: Address): Promise<NodeHolderData> {
    const balance = await this.getNodeBalance(userAddress);
    const tier = this.getNodeTier(balance);
    const benefits = TIER_BENEFITS[tier];

    return {
      balance,
      tier,
      benefits
    };
  }


  /**
   * Calculate estimated bridge time (removed priority logic)
   */
  static getEstimatedBridgeTime(): string {
    return "10-20 minutes"; // Standard time for all users
  }

  /**
   * Check if amount is within tier limits
   */
  static isAmountWithinLimits(amount: bigint, tier: NodeTier): boolean {
    return amount <= TIER_BENEFITS[tier].maxBridgeAmount;
  }

  /**
   * Calculate fee discount for NODE holders
   */
  static calculateFeeDiscount(baseFee: bigint, tier: NodeTier): {
    originalFee: bigint;
    discountPercent: number;
    discountAmount: bigint;
    finalFee: bigint;
  } {
    const discountPercent = TIER_BENEFITS[tier].feeDiscount;
    const discountAmount = (baseFee * BigInt(discountPercent)) / BigInt(100);
    const finalFee = baseFee - discountAmount;

    return {
      originalFee: baseFee,
      discountPercent,
      discountAmount,
      finalFee
    };
  }
}