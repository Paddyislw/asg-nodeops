import type { Metadata } from 'next';

export interface SEOProps {
  title: string;
  description: string;
  path: string;
  imageUrl?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  keywords?: string[];
}

export function generateSEOMetadata({
  title,
  description,
  path,
  imageUrl = '/public/next.svg',
  imageAlt,
  type = 'website',
  keywords = [],
}: SEOProps): Metadata {
  const url = `https://node-bridge.com${path}`;

  return {
    title,
    description,
    keywords: [
      'NODE Bridge',
      'blockchain',
      'DeFi',
      'cryptocurrency',
      ...keywords,
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-video-preview': -1,
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'NODE Bridge',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: imageAlt || title,
        },
      ],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}