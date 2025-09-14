# SEO Implementation Notes

## Overview
This document outlines the SEO implementation in our Next.js application. We use a combination of server-side rendering (SSR), static metadata, and dynamic metadata generation to ensure optimal search engine visibility.

## Key Features

### 1. Metadata Generation
We use a centralized metadata generation system through `lib/seo-utils.ts` that provides:
- Dynamic title and description generation
- OpenGraph and Twitter card support
- Automatic keyword management
- Robots meta configuration
- Canonical URL handling

```typescript
// Example usage in layout files
export const metadata = generateSEOMetadata({
  title: "Your Page Title",
  description: "Your page description",
  path: "/your-path",
  keywords: ["keyword1", "keyword2"]
});
```

### 2. Structured Data
We implement JSON-LD structured data for different page types:

- **Root Application** (`components/SEO/StructuredData.tsx`)
  - Type: WebApplication
  - Includes: Features, pricing, and provider information

- **Bridge Pages** (`components/SEO/BridgeStructuredData.tsx`)
  - Type: Service
  - Includes: Chain information, token details, and service specifics

- **Dashboard** (`components/SEO/DashboardStructuredData.tsx`)
  - Type: WebPage with Dashboard entity
  - Includes: Analytics, transaction statistics, and user tier information

### 3. Route-Specific SEO

#### Homepage (`app/layout.tsx`)
- General application metadata
- Primary keywords and descriptions
- Default OpenGraph images

#### Bridge Routes (`app/bridge/usdc/eth-base/layout.tsx`)
- Dynamic metadata based on:
  - Source and destination chains
  - Token information
  - Bridge-specific keywords

#### Dashboard (`app/dashboard/layout.tsx`)
- Analytics-focused metadata
- User-specific information
- Transaction statistics

## Best Practices

1. **Metadata Generation**
   - Always use the `generateSEOMetadata` utility for consistency
   - Include relevant, specific keywords
   - Provide unique descriptions for each page
   - Use proper image alt texts

2. **Structured Data**
   - Keep JSON-LD data up to date with page content
   - Include all relevant fields for each schema type
   - Validate structured data using Google's testing tool

3. **Dynamic Content**
   - Update metadata when content changes
   - Use appropriate schema types for different content
   - Include real-time data in structured data where relevant

## Image Optimization

Replace placeholder images (`/public/next.svg`) with:
- High-quality OpenGraph images
- Properly sized social media cards
- Relevant page-specific images

## Resources

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)