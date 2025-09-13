// lib/node-token.ts
import { type Address } from "viem";

// Configuration for NODE token - easily replaceable for testing
export const NODE_TOKEN_CONFIG = {
  // Main NODE token on Ethereum
  ethereum: {
    address: "0x2f714d7b9a035d4ce24af8d9b6091c07e37f43fb" as Address,
    decimals: 18,
    symbol: "NODE",
    name: "Node Token"
  },
  
  // For testing purposes - you can replace these addresses
  testnet: {
    // Replace with your test token address for testing
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" as Address,
    decimals: 6,
    symbol: "USDC",
    name: "Sepolia USDC"
  }
} as const;

// Switch between main and test configuration
export const CURRENT_NODE_CONFIG = NODE_TOKEN_CONFIG.testnet;

// Tier thresholds - adjust these values as needed
export const NODE_TIERS = {
  BRONZE: BigInt("5000000"), // 5 USDC
  SILVER: BigInt("8000000"), // 8 USDC
  GOLD: BigInt("10000000"), // 10 USDC
  DIAMOND: BigInt("100000000"), // 100 USDC
} as const;

export type NodeTier = keyof typeof NODE_TIERS | "NONE";

export const TIER_BENEFITS = {
  NONE: {
    feeDiscount: 0,
    analytics: false,
    maxBridgeAmount: BigInt("1000000000"), // 1 USDC
    historicalDataAccess: false,
    advancedAnalytics: false,
    customAlerts: false
  },
  BRONZE: {
    feeDiscount: 5, // 5% discount
    analytics: true,
    maxBridgeAmount: BigInt("10000000000"), // 5 USDC
    historicalDataAccess: true,
    advancedAnalytics: false,
    customAlerts: false
  },
  SILVER: {
    feeDiscount: 10, // 10% discount
    analytics: true,
    maxBridgeAmount: BigInt("50000000000"), // 8 USDC
    historicalDataAccess: true,
    advancedAnalytics: true,
    customAlerts: false
  },
  GOLD: {
    feeDiscount: 15, // 15% discount
    analytics: true,
    maxBridgeAmount: BigInt("100000000000"), // 10 USDC
    historicalDataAccess: true,
    advancedAnalytics: true,
    customAlerts: true
  },
  DIAMOND: {
    feeDiscount: 25, // 25% discount
    analytics: true,
    maxBridgeAmount: BigInt("500000000000"), // 100 USDC
    historicalDataAccess: true,
    advancedAnalytics: true,
    customAlerts: true
  }
} as const;