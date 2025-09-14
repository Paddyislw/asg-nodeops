import type { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo-utils';

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'NODE Bridge Dashboard - Analytics & Bridge Statistics',
    description: 'Track your cross-chain bridge transactions, view analytics, and manage your NODE token holdings. Get insights into your bridging activity and unlock premium features.',
    path: '/dashboard',
    keywords: [
      'bridge dashboard',
      'analytics',
      'node token',
      'bridge statistics',
      'transaction history',
      'cross-chain analytics',
    ],
    type: 'website',
  });
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}