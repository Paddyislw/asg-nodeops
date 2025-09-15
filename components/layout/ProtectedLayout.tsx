"use client";

import { useAccount, useChainId, useConnect, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CustomConnectButton } from "@/components/wallet/CustomConnectButton";
import { AlertCircle, Loader2, WifiOff } from "lucide-react";
import Header from "./Header";
import { redirect } from "next/navigation";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const chainId = useChainId();
  const { connectors, isPending: isConnectLoading } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getSupportedChains = () => [
    { id: 11155111, name: "Sepolia Testnet" },
    { id: 84532, name: "Base Sepolia" },
  ];

  const isSupported = (id: number) => [11155111, 84532].includes(id);

  const isProtectedRoute =
    pathname?.includes("/bridge") || pathname?.includes("/dashboard");
    
  const isValidRoute =
    pathname?.includes("/bridge") ||
    pathname?.includes("/dashboard") ||
    pathname?.includes("/instructions");

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
    // For bridge and dashboard routes, show header with connect wallet message
    if (isProtectedRoute) {
      return (
        <div className="min-h-screen">
          <Header />
          <main className="mx-auto max-w-5xl p-4">
            <div className="flex items-center justify-center min-h-[80vh]">
              <div className="text-center space-y-6 max-w-md mx-auto p-8">
                <div className="space-y-4">
                  <WifiOff className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Connect Your Wallet
                    </h2>
                    <p className="text-muted-foreground">
                      Connect your wallet to access the NODE Bridge and view
                      your token holdings
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
          </main>
        </div>
      );
    }

    // For instructions and other routes, show header but allow access without wallet
    if (isValidRoute) {
      return (
        <div className="min-h-screen">
          <Header />
          <main className="mx-auto max-w-5xl p-4">{children}</main>
        </div>
      );
    }

    // For any other routes redirect to default bridge page
   redirect("/bridge/usdc/eth-base");
  }

  // At this point, we know the user is connected
  const isChainSupported = isSupported(chainId);

  const renderBanner = () => {
    if (isChainSupported) return null;

    return (
      <div className="">
        <div className="mx-auto max-w-5xl flex items-center justify-between bg-yellow-500/10 border border-yellow-500/20 px-4 py-3 rounded-lg">
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
      {isProtectedRoute && <Header />}
      {isProtectedRoute && renderBanner()}
      {isProtectedRoute ? (
        <main className="mx-auto max-w-5xl p-4">{children}</main>
      ) : (
        children
      )}
    </div>
  );
}
