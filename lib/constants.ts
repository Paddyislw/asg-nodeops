import { sepolia, baseSepolia, mainnet } from "wagmi/chains";
import type { Address } from "viem";
import { CCTP_USDC_CONTRACTS } from "./contracts";

// Chains users can switch to and use for bridging
export const SUPPORTED_CHAINS = [sepolia, baseSepolia] as const;

// All chains including read-only ones (like mainnet for NODE token balance)
export const ALL_CHAINS = [sepolia, baseSepolia, mainnet] as const;

export const BRIDGE_CHAINS = {
  sepolia,
  baseSepolia,
} as const;

/** Per-chain ERC20 map - Using CCTP USDC addresses */
export const TOKENS: Record<
  number,
  { symbol: string; address: Address; decimals: number }[]
> = {
  [BRIDGE_CHAINS.sepolia.id]: [
    {
      symbol: "USDC",
      address: CCTP_USDC_CONTRACTS[BRIDGE_CHAINS.sepolia.id],
      decimals: 6,
    },
  ],
  [BRIDGE_CHAINS.baseSepolia.id]: [
    {
      symbol: "USDC",
      address: CCTP_USDC_CONTRACTS[BRIDGE_CHAINS.baseSepolia.id],
      decimals: 6,
    },
  ],
};

export const NODE_TOKEN_MAINNET = (process.env
  .NEXT_PUBLIC_NODE_TOKEN_ADDRESS_MAINNET ||
  "0x2f714d7b9a035d4ce24af8d9b6091c07e37f43fb") as Address; // $NODE mainnet (read-only)
