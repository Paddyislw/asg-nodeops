import React from 'react';

interface BridgeStructuredDataProps {
  fromChain: string;
  toChain: string;
  tokenSymbol: string;
}

export default function BridgeStructuredData({ fromChain, toChain, tokenSymbol }: BridgeStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${tokenSymbol} Bridge from ${fromChain} to ${toChain}`,
    description: `Securely bridge your ${tokenSymbol} tokens from ${fromChain} to ${toChain} using NODE Bridge's cross-chain transfer service.`,
    provider: {
      '@type': 'Organization',
      name: 'NODE Bridge',
      description: 'Provider of secure multi-chain token bridging solutions',
    },
    serviceType: 'Token Bridge',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    areaServed: [fromChain, toChain],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}