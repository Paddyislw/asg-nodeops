"use client";

import { http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import { SUPPORTED_CHAINS } from "./constants";
import { WagmiProvider } from "wagmi";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo";

export const config = getDefaultConfig({
  appName: "NODE Bridge",
  projectId,
  chains: SUPPORTED_CHAINS,
  ssr: true,
  transports: {
    [SUPPORTED_CHAINS[0].id]: http("https://eth-sepolia.g.alchemy.com/v2/" + 'XGfGEEgHBrrKXLvKPA-QX'),
    [SUPPORTED_CHAINS[1].id]: http("https://base-sepolia.g.alchemy.com/v2/" + 'XGfGEEgHBrrKXLvKPA-QX'),
    [SUPPORTED_CHAINS[2].id]: http(process.env.NEXT_PUBLIC_RPC_MAINNET),
  },
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
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
