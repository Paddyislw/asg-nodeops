"use client";

import {
  ExternalLink,
  Wallet,
  ArrowRight,
  Info,
  AlertCircle,
} from "lucide-react";

export default function InstructionsPage() {
  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            How to Bridge Tokens
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn how to bridge your tokens from Ethereum Sepolia to Base
            Sepolia and get testnet tokens for bridging
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Get Sepolia USDC Card */}
          <div className="rounded-xl border border-border bg-card/50 p-6 space-y-4 flex flex-col">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Get Sepolia USDC
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Testnet USDC for bridging
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To bridge tokens, you'll need Sepolia USDC. Get free testnet
                  USDC from Circle's official faucet.
                </p>

                <div className="rounded-lg border border-border bg-muted/20 p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        You'll need to connect your wallet and request testnet
                        USDC. The faucet provides sufficient tokens for testing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <a
              href="https://faucet.circle.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-black w-full rounded-lg border border-border hover:bg-muted/10 px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              Get Sepolia USDC
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          {/* Get Sepolia ETH Card */}
          <div className="rounded-xl border border-border bg-card/50 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center">
                <Wallet className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Get Sepolia ETH
                </h2>
                <p className="text-sm text-muted-foreground">
                  For transaction gas fees
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                You'll need Sepolia ETH to pay for gas fees when bridging your
                tokens. Get free testnet ETH from Google Cloud's faucet.
              </p>

              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Connect your wallet to receive testnet ETH. This covers
                      gas costs for bridge transactions.
                    </p>
                  </div>
                </div>
              </div>

              <a
                href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-black w-full rounded-lg border border-border hover:bg-muted/10 px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                Get Sepolia ETH
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bridge Steps */}
        <div className="rounded-xl border border-border bg-card/50 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                How to Bridge Your Tokens
              </h2>
              <p className="text-sm text-muted-foreground">
                Step-by-step bridging process
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Connect Your Wallet",
                description:
                  "Connect your wallet and ensure you're on the Ethereum Sepolia network. The bridge only works from Sepolia to Base Sepolia.",
              },
              {
                step: "2",
                title: "Get Testnet Tokens",
                description:
                  "Use the faucets above to get Sepolia USDC (for bridging) and Sepolia ETH (for gas fees). Make sure you have both before proceeding.",
              },
              {
                step: "3",
                title: "Navigate to Bridge",
                description:
                  "Go to the Bridge page from the navigation menu. The bridge interface will guide you through the process.",
              },
              {
                step: "4",
                title: "Select Networks",
                description:
                  "Choose 'Ethereum Sepolia' as the source network and 'Base Sepolia' as the destination network.",
              },
              {
                step: "5",
                title: "Enter Amount",
                description:
                  "Select USDC token and enter the amount you want to bridge. You can use the 'Max' button to bridge all available tokens.",
              },
              {
                step: "6",
                title: "Review and Execute",
                description:
                  "Review your bridge details and click 'Bridge Tokens'. Confirm the transaction in your wallet and wait for completion.",
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground text-sm font-semibold flex-shrink-0">
                  {item.step}
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="rounded-xl border border-border bg-muted/10 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">
              Important Notes
            </h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              • <strong>Network Requirement:</strong> You must be connected to
              Ethereum Sepolia network to use the bridge.
            </p>
            <p>
              • <strong>Supported Tokens:</strong> Currently only USDC bridging
              is supported from Sepolia to Base Sepolia.
            </p>
            <p>
              • <strong>Gas Fees:</strong> Make sure you have sufficient Sepolia
              ETH for transaction gas fees.
            </p>
            <p>
              • <strong>Transaction Time:</strong> Bridge transactions typically
              complete within a few minutes.
            </p>
            <p>
              • <strong>Testnet Only:</strong> This is a testnet bridge. Do not
              use real mainnet tokens.
            </p>
          </div>
        </div>

        {/* Ready to Bridge CTA */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Ready to Bridge?
          </h2>
          <p className="text-muted-foreground">
            Once you have your testnet tokens, head to the bridge to get started
          </p>
          <a
            href="/bridge/usdc/eth-base"
            className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 font-medium transition-all duration-200 group"
          >
            Go to Bridge
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
