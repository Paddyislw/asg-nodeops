import React from 'react';

interface DashboardStructuredDataProps {
  totalBridged?: string;
  totalTransactions?: number;
  tier?: string;
}

export default function DashboardStructuredData({
  totalBridged = '0',
  totalTransactions = 0,
  tier = 'NONE',
}: DashboardStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'NODE Bridge Dashboard',
    description: 'Track your cross-chain bridge transactions and NODE token analytics',
    mainEntity: {
      '@type': 'Dashboard',
      name: 'NODE Bridge Analytics Dashboard',
      description: `Access detailed analytics and statistics for your bridge transactions. Current tier: ${tier}`,
      interactionStatistic: [
        {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/BridgeTransaction',
          userInteractionCount: totalTransactions,
        },
        {
          '@type': 'MonetaryAmount',
          name: 'Total Amount Bridged',
          currency: 'USD',
          value: totalBridged,
        },
      ],
      membershipTier: tier,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}