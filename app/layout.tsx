import type { Metadata } from "next";
import "./globals.css";
import { Web3Providers } from "@/lib/wagmi";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import StructuredData from "@/components/SEO/StructuredData";
import { generateSEOMetadata } from "@/lib/seo-utils";

export const metadata: Metadata = generateSEOMetadata({
  title: "NODE Bridge - Multi-Chain Token Bridge Platform",
  description: "Secure and efficient multi-chain token bridge platform for TestUSDC. Transfer your tokens across different blockchain networks seamlessly.",
  path: "/",
  keywords: [
    "token bridge",
    "cross-chain",
    "blockchain",
    "TestUSDC",
    "cryptocurrency",
    "DeFi",
    "multi-chain",
    "token transfer",
    "bridge platform"
  ],
  imageUrl: "/public/next.svg", // Replace with your actual OG image
  imageAlt: "NODE Bridge Platform Preview",
  type: "website"
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
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
