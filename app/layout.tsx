// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Web3Providers } from "@/lib/wagmi";
import { CustomConnectButton } from "@/components/wallet/CustomConnectButton";


export const metadata: Metadata = {
  title: "NODE Bridge",
  description: "Multi-chain token bridge (simulated) for TestUSDC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#000] text-white">
        <Web3Providers>
          <div className="min-h-screen">
            <header className="sticky top-0 z-20 border-b border-white/10 bg-black/60 backdrop-blur">
              <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
                <h1 className="text-lg font-semibold">NODE Bridge</h1>
                <CustomConnectButton />
              </div>
            </header>
            <main className="mx-auto max-w-5xl p-4">{children}</main>
          </div>
        </Web3Providers>
      </body>
    </html>
  );
}
