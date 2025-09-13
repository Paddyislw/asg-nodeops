import type { Address } from "viem";
import { getAddress } from "viem";
import { mainnet, sepolia, baseSepolia } from "wagmi/chains";

const BRIDGE_CHAINS = {
  sepolia,
  baseSepolia,
} 
/**
 * Circle CCTP TokenMessenger contracts (testnet official)
 */
// Circle CCTP TokenMessenger contract addresses per chain (official testnet addresses)
export const CCTP_TOKEN_MESSENGER_CONTRACTS: Record<number, Address> = {
  // Ethereum Sepolia
  [BRIDGE_CHAINS.sepolia.id]: getAddress(
    "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5"
  ),
  // Base Sepolia
  [BRIDGE_CHAINS.baseSepolia.id]: getAddress(
    "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA"
  ),
};

/**
 * Circle CCTP MessageTransmitter contracts (testnet official) 
 */
export const CCTP_MESSAGE_TRANSMITTER_CONTRACTS: Record<number, Address> = {
  [BRIDGE_CHAINS.sepolia.id]: getAddress(
    "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD"
  ),
  [BRIDGE_CHAINS.baseSepolia.id]: getAddress(
    "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD"
  ),
};

/**
 * Circle CCTP Domain IDs (testnet official)
 */
export const CCTP_DOMAIN_IDS: Record<number, number> = {
  [BRIDGE_CHAINS.sepolia.id]: 0, // Ethereum Sepolia
  [BRIDGE_CHAINS.baseSepolia.id]: 6, // Base Sepolia
};

/**
 * Circle Testnet USDC contracts
 */
export const CCTP_USDC_CONTRACTS: Record<number, Address> = {
  [BRIDGE_CHAINS.sepolia.id]: getAddress(
    "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
  ),
  [BRIDGE_CHAINS.baseSepolia.id]: getAddress(
    "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
  ),
};

// For backward compatibility
export const BRIDGE_CONTRACTS = CCTP_TOKEN_MESSENGER_CONTRACTS;

export enum CCTPBridgeStatus {
  PENDING = 0,
  COMPLETED = 1,
  FAILED = 2,
}

export const BRIDGE_TRACKER_CONTRACTS = {
  11155111: "0xf310eeEd90EEF3a408961D61Eb991C9017CE6EAd" as Address, // Sepolia deployment ✅
  84532: "0xd5770B4f205E211c2b0EbE649d5b5dCa53CF7B0B" as Address, // Base Sepolia deployment
} as const;

// For backward compatibility
export const BridgeStatus = CCTPBridgeStatus;
