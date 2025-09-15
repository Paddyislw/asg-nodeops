"use client";

import { PlayCircle, ExternalLink } from "lucide-react";

export default function DemoPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            NODE Bridge Demo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how the NODE Bridge application works in this comprehensive demo video
          </p>
        </div>

        {/* Video Section */}
        <div className="rounded-xl border border-border bg-card/50 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Demo Video
              </h2>
              <p className="text-sm text-muted-foreground">
                Complete walkthrough of the bridge functionality
              </p>
            </div>
          </div>

          {/* YouTube Embed */}
          <div className="aspect-video rounded-lg overflow-hidden border border-border">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/GtjPi00zs9w"
              title="NODE Bridge Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Video Details */}
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <h3 className="font-medium text-foreground mb-2">What's covered in this demo:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Wallet connection and network switching</li>
                <li>• Getting testnet tokens from faucets</li>
                <li>• Bridge setup and token selection</li>
                <li>• Transaction execution and monitoring</li>
                <li>• Dashboard analytics and NODE token features</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <a
                href="https://youtu.be/GtjPi00zs9w"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 font-medium transition-all duration-200 group"
              >
                Watch on YouTube
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card/50 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Try it Yourself
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ready to test the bridge? Follow the instructions to get testnet tokens and start bridging.
            </p>
            <a
              href="/instructions"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/90 text-sm font-medium"
            >
              View Instructions
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="rounded-xl border border-border bg-card/50 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Start Bridging
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your wallet and start bridging USDC from Ethereum Sepolia to Base Sepolia.
            </p>
            <a
              href="/bridge/usdc/eth-base"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/90 text-sm font-medium"
            >
              Go to Bridge
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}