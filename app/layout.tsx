import type { Metadata } from "next";
import "./globals.css";
import { Web3Providers } from "@/lib/wagmi";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";

export const metadata: Metadata = {
  title: "NODE Bridge",
  description: "Multi-chain token bridge (simulated) for TestUSDC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#000] text-white">
        <Web3Providers>
          <ProtectedLayout>
            {children}
          </ProtectedLayout>
        </Web3Providers>
      </body>
    </html>
  );
}
