"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDown } from "lucide-react";
import { useAccount, useChainId } from "wagmi";
import { useEffect } from "react";

// Optional: NodeBridge chain slug, agar kabhi tracking/URLs me chahiye ho
const chainSlug: Record<number, string> = {
  11155111: "sepolia",
  84532: "base-sepolia",
};

export function CustomConnectButton() {
  // ❗ setState ko render ke andar mat karo — wagmi hooks use karo:
  const { address, isConnected } = useAccount();
  const activeChainId = useChainId();

  // yahan tum apni analytics / API calls fire kar sakte ho
  useEffect(() => {
    if (isConnected && address && activeChainId) {
      // example: console / analytics
      console.log("User connected:", {
        walletAddress: address,
        chainId: String(activeChainId),
        chainSlug: chainSlug[activeChainId] ?? String(activeChainId),
      });
    }
  }, [isConnected, address, activeChainId]);

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
            })}
          >
            {!connected ? (
              <button
                onClick={openConnectModal}
                type="button"
                className="rounded-xl2 bg-primary px-5 py-3 font-semibold text-black transition-opacity hover:opacity-90 rounded-lg"
              >
                Connect Wallet
              </button>
            ) : chain?.unsupported ? (
              <button
                onClick={openChainModal}
                type="button"
                className="rounded-xl2 bg-red-500 px-4 py-3 text-white transition-colors hover:bg-red-600"
              >
                Wrong Network
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-xl2 bg-primary px-4 py-2.5 text-black rounded-lg">
                <button
                  onClick={openChainModal}
                  type="button"
                  className="flex items-center gap-2 transition-opacity hover:opacity-80"
                  title="Switch network"
                >
                  {chain && (
                    <>
                      <div
                        className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border"
                        style={{ background: chain.iconBackground }}
                      >
                        {chain.iconUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            className="h-7 w-7 object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold">
                            {chain.name?.[0] ?? "?"}
                          </span>
                        )}
                      </div>
                      <span className="hidden text-sm font-medium sm:inline">
                        {chain.name}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="h-6 w-px bg-black/20" />

                <button
                  onClick={openAccountModal}
                  type="button"
                  className="max-w-[140px] truncate font-mono text-sm transition-opacity hover:opacity-80 sm:max-w-[180px]"
                  title={account?.address}
                >
                  {account?.displayName}
                </button>
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
