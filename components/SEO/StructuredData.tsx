import React from 'react';

export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'NODE Bridge',
    description: 'Secure and efficient multi-chain token bridge platform for TestUSDC',
    applicationCategory: 'DeFi',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    features: [
      'Cross-chain token transfers',
      'Multi-chain support',
      'Secure bridging',
      'TestUSDC compatibility',
    ],
    provider: {
      '@type': 'Organization',
      name: 'NODE Bridge',
      description: 'Provider of secure multi-chain token bridging solutions',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}