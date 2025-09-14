"use client";

import { http, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import { ALL_CHAINS, SUPPORTED_CHAINS } from "./constants";
import { WagmiProvider } from "wagmi";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo";

const { wallets } = getDefaultWallets({
  appName: "NODE Bridge",
  projectId,
});

const connectors = connectorsForWallets(wallets, {
  appName: "NODE Bridge",
  projectId,
});

export const config = createConfig({
  connectors,
  chains: ALL_CHAINS, // Include all chains for wagmi functionality
  transports: {
    [ALL_CHAINS[0].id]: http("https://eth-sepolia.g.alchemy.com/v2/" + 'XGfGEEgHBrrKXLvKPA-QX'),
    [ALL_CHAINS[1].id]: http("https://base-sepolia.g.alchemy.com/v2/" + 'XGfGEEgHBrrKXLvKPA-QX'),
    [ALL_CHAINS[2].id]: http(process.env.NEXT_PUBLIC_RPC_MAINNET), // Mainnet for read-only NODE token balance
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            borderRadius: "large",
            accentColor: "#eaf740",
            accentColorForeground: "#000000",
          })}
          modalSize="compact"
          initialChain={SUPPORTED_CHAINS[0]}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
