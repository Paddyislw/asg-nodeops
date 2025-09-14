"use client";

import { useAccount, useChainId, useConnect, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { CustomConnectButton } from "@/components/wallet/CustomConnectButton";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Wifi,
  WifiOff,
  Globe,
} from "lucide-react";
import Header from "./Header";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const chainId = useChainId();
  const { connectors, isPending: isConnectLoading } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getSupportedChains = () => [
    { id: 11155111, name: "Sepolia Testnet" },
    { id: 84532, name: "Base Sepolia" },
  ];

  const isSupported = (id: number) => [11155111, 84532].includes(id);

  // Show loading state
  if (!mounted || isConnecting || isConnectLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <div>
            <div className="text-xl font-semibold">
              {!mounted ? "Initializing..." : "Connecting Wallet"}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {!mounted
                ? "Loading application..."
                : "Please confirm the connection in your wallet"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show connect prompt when not connected
  if (!isConnected || isDisconnected) {
    return (
      <div className="min-h-screen bg-background">
        <header className=" bg-black/60 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <h1 className="text-lg font-semibold">NODE Bridge</h1>
          </div>
        </header>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center space-y-6 max-w-md mx-auto p-8">
            <div className="space-y-4">
              <WifiOff className="h-16 w-16 text-muted-foreground mx-auto" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
                <p className="text-muted-foreground">
                  Connect your wallet to access the NODE Bridge and view your
                  token holdings
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <CustomConnectButton />
              <div className="text-xs text-muted-foreground">
                Supported networks: Sepolia Testnet, Base Sepolia
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // At this point, we know the user is connected
  const isChainSupported = isSupported(chainId);

  const renderBanner = () => {
    if (isChainSupported) return null;

    return (
      <div className="bg-yellow-500/10 border-y border-yellow-500/20 px-4 py-3">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-yellow-400">
                Unsupported Network
              </div>
              <div className="text-xs text-yellow-200 mt-1">
                Please switch to one of the supported networks:{" "}
                {getSupportedChains()
                  .map((c) => c.name)
                  .join(", ")}
              </div>
            </div>
          </div>
          <button
            onClick={() => disconnect()}
            className="text-xs text-yellow-400 hover:text-yellow-300 underline"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  };

  // Connected user layout
  return (
    <div className="min-h-screen">
      <Header />

      {renderBanner()}

      <main className="mx-auto max-w-5xl p-4">{children}</main>

      {/* Connection Status Footer */}
      <footer className="border-t border-white/10 bg-black/60 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>NODE Bridge v1.0</span>
              <span>
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>Supported: Sepolia Testnet, Base Sepolia</span>
              <span>{connectors?.length || 0} wallet(s) available</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
