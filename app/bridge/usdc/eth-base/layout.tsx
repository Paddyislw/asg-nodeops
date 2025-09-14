import type { Metadata } from 'next';
import { BRIDGE_CHAINS, TOKENS } from '@/lib/constants';
import { generateSEOMetadata } from '@/lib/seo-utils';

interface BridgePageParams {
  params: {
    chain: string;
    token: string;
  };
}

export async function generateMetadata({ params }: BridgePageParams): Promise<Metadata> {
  const fromChain = BRIDGE_CHAINS.sepolia.name;
  const toChain = BRIDGE_CHAINS.baseSepolia.name;
  const tokenInfo = TOKENS[BRIDGE_CHAINS.sepolia.id]?.[0];
  const tokenSymbol = tokenInfo?.symbol || 'USDC';

  const title = `Bridge ${tokenSymbol} from ${fromChain} to ${toChain} | NODE Bridge`;
  const description = `Securely transfer your ${tokenSymbol} tokens from ${fromChain} to ${toChain} using NODE Bridge's fast and reliable cross-chain bridge service. Get the best rates and fastest transfer times.`;

  return generateSEOMetadata({
    title,
    description,
    path: `/bridge/usdc/eth-base`,
    imageAlt: `${tokenSymbol} Bridge from ${fromChain} to ${toChain}`,
    keywords: [
      'token bridge',
      'cross-chain bridge',
      tokenSymbol,
      fromChain,
      toChain,
      'bridge tokens',
      'token transfer',
      `${fromChain} to ${toChain}`,
      `${tokenSymbol} bridge`,
    ],
  });
}

export default function BridgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}