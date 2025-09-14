# NODE Bridge - Multi-Chain Token Bridge Platform

A secure and efficient multi-chain token bridge platform that allows users to bridge TestUSDC tokens from Ethereum Sepolia to Base Sepolia, with premium features unlocked through NODE token holdings.

## Features

### Core Bridge Functionality
- Cross-Chain USDC Bridging: Transfer TestUSDC from Ethereum Sepolia to Base Sepolia
- Wallet Integration: Connect using RainbowKit with multiple wallet options
- Real-time Transaction Tracking: Monitor bridge progress with live status updates
- Bridge History: Track all your previous bridge transactions
- Responsive Design: Clean, minimal UI that works on all devices

### NODE Token Integration
- Tier-Based Benefits: Unlock premium features based on your NODE token holdings
- Fee Discounts: Get reduced bridge fees with higher tiers
- Advanced Analytics: Access detailed bridge statistics and insights
- Enhanced Limits: Bridge larger amounts with premium tiers

## Setup Instructions

### Prerequisites
- Node.js 18 or higher
- npm, yarn, or pnpm package manager
- Web3 wallet (MetaMask, Coinbase Wallet, WalletConnect supported wallets)
- TestUSDC tokens on Ethereum Sepolia testnet
- Sepolia ETH for transaction gas fees

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd node-bridge
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   The application is pre-configured for Sepolia testnet. No additional environment variables are required for basic functionality.

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open application**
   Navigate to `http://localhost:3000` in your browser

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

### Getting Test Tokens

Before using the bridge, obtain testnet tokens:

1. **Sepolia USDC**: Visit Circle's official faucet at https://faucet.circle.com/
2. **Sepolia ETH**: Visit Google Cloud's Ethereum faucet at https://cloud.google.com/application/web3/faucet/ethereum/sepolia

### Network Configuration

The bridge is configured for the following networks:
- Source Network: Ethereum Sepolia (Chain ID: 11155111)
- Destination Network: Base Sepolia (Chain ID: 84532)
- Supported Token: TestUSDC

## NODE Token Integration

### Tier System Overview

The platform implements a comprehensive tier system based on NODE token holdings. Users are classified into different tiers that unlock various benefits and features.

### Tier Structure

**NONE Tier (No NODE Holdings)**
- Analytics Access: None
- Fee Discount: 0%
- Max Bridge Amount: $1 USDC
- Historical Data: No access
- Advanced Analytics: Not available
- Custom Alerts: Not available

**BRONZE Tier (5+ USDC)**
- Analytics Access: Basic bridge analytics
- Fee Discount: 5%
- Max Bridge Amount: $10 USDC
- Historical Data: Full access
- Advanced Analytics: Not available
- Custom Alerts: Not available

**SILVER Tier (8+ USDC)**
- Analytics Access: Enhanced analytics
- Fee Discount: 10%
- Max Bridge Amount: $50 USDC
- Historical Data: Full access
- Advanced Analytics: Available
- Custom Alerts: Not available

**GOLD Tier (10+ USDC)**
- Analytics Access: Premium analytics
- Fee Discount: 15%
- Max Bridge Amount: $100 USDC
- Historical Data: Full access
- Advanced Analytics: Available
- Custom Alerts: Available

**DIAMOND Tier (100+ USDC)**
- Analytics Access: Ultimate analytics
- Fee Discount: 25%
- Max Bridge Amount: $500 USDC
- Historical Data: Full access
- Advanced Analytics: Available
- Custom Alerts: Available

### Technical Implementation

#### Core Components

**NODE Token Service (`lib/node-service.ts`)**
- Handles balance checking and tier determination
- Manages user analytics and fee calculations
- Provides benefit validation and access control

**NODE Token Configuration (`lib/node-token.ts`)**
- Manages token contract addresses and configurations
- Defines tier thresholds and benefit mappings

**Custom Hooks (`hooks/useNodeToken.ts`)**
- `useNodeToken()`: Fetches and manages NODE token data
- Provides real-time data updates and error handling
- Implements automatic refetching on wallet changes

**Dashboard Components (`components/dashboard/`)**
- NodeStatusCard: Displays user tier and benefits
- AnalyticsDashboard: Shows bridge statistics and insights
- TierProgress: Visualizes progress to next tier
- NodeTierBadge: Provides visual tier indicators

#### Integration Flow

1. **Wallet Connection**: User connects wallet using RainbowKit
2. **Balance Verification**: System fetches NODE token balance from blockchain
3. **Tier Calculation**: Determines user tier based on current balance
4. **Benefit Application**: Applies tier-specific limits and discounts
5. **Bridge Enhancement**: Processes bridge transactions with premium features
6. **Analytics Tracking**: Updates user statistics and transaction history
7. **Dashboard Display**: Shows enhanced analytics and tier information


## SEO Implementation

### Overview
The application implements comprehensive SEO optimization to ensure maximum visibility and discoverability across search engines.

### Meta Tags and Structured Data
- Dynamic meta tags for each page with relevant keywords
- Open Graph tags for social media sharing
- JSON-LD structured data for enhanced search results
- Canonical URLs and proper meta descriptions

### Page-Specific SEO

**Homepage and Bridge Page**
- Optimized for "token bridge", "cross-chain", "USDC bridge" keywords
- Structured data includes bridge functionality and supported networks
- Meta descriptions highlighting key features and benefits

**Dashboard Page**
- Focused on "crypto analytics", "bridge statistics", "NODE token" keywords
- Structured data for user analytics and tier information
- Dynamic content based on user's NODE holdings

**Instructions Page**
- Optimized for "how to bridge tokens", "testnet faucet", tutorial keywords
- Step-by-step structured data for enhanced snippets
- Rich content with detailed explanations

### Technical SEO Features
- Server-side rendering with Next.js for improved crawling
- Semantic HTML structure with proper heading hierarchy
- Optimized loading performance with code splitting
- Mobile-responsive design for mobile-first indexing
- Clean URL structure and proper internal linking

### Implementation Files
- `lib/seo-utils.ts`: Utility functions for generating SEO metadata
- `components/SEO/StructuredData.tsx`: JSON-LD structured data components
- Individual page SEO configurations with targeted keywords and descriptions

## Technical Architecture

### Core Components

#### 1. NODE Token Service (`lib/node-service.ts`)
Handles all $NODE token interactions:
- **Balance Checking**: Fetch user's $NODE token balance
- **Tier Determination**: Calculate user's tier based on balance
- **Benefits Calculation**: Determine available features per tier
- **Analytics Management**: Store and retrieve user analytics
- **Fee Calculations**: Apply tier-based discounts

#### 2. NODE Token Configuration (`lib/node-token.ts`)
Manages token configuration and tier thresholds:
- **Token Contracts**: Ethereum mainnet and testnet configurations
- **Tier Thresholds**: Balance requirements for each tier
- **Benefit Definitions**: Features available per tier
- **Flexible Configuration**: Easy switching between mainnet/testnet

#### 3. Custom Hooks (`hooks/useNodeToken.ts`)
React hooks for NODE integration:
- **`useNodeToken()`**: Fetch and manage NODE token data
- **`useUserAnalytics()`**: Handle user analytics and updates
- **Real-time Updates**: Automatically refetch data when needed
- **Error Handling**: Graceful handling of API failures

#### 4. Dashboard Components (`components/dashboard/`)
UI components for NODE features:
- **NodeStatusCard**: Display user's tier and benefits
- **AnalyticsDashboard**: Show bridge statistics and insights
- **TierProgress**: Visualize progress to next tier
- **NodeTierBadge**: Visual tier indicators

### Bridge Flow with NODE Integration

1. **Wallet Connection**: User connects wallet using RainbowKit
2. **NODE Balance Check**: System fetches user's $NODE token balance
3. **Tier Calculation**: Determine user's tier based on balance
4. **Benefits Application**: Apply tier-specific limits and discounts
5. **Bridge Execution**: Process bridge with enhanced features
6. **Analytics Update**: Store transaction data for analytics
7. **Dashboard Display**: Show updated statistics and benefits

### Configuration System

The platform uses a flexible configuration system for easy testing and deployment:

```typescript
// Current configuration points to testnet USDC for testing
export const CURRENT_NODE_CONFIG = NODE_TOKEN_CONFIG.testnet;

// Tier thresholds using testnet USDC values
export const NODE_TIERS = {
  BRONZE: BigInt("5000000"),   // 5 USDC
  SILVER: BigInt("8000000"),   // 8 USDC
  GOLD: BigInt("10000000"),    // 10 USDC
  DIAMOND: BigInt("100000000") // 100 USDC
};
```

## 🎯 Key Features Breakdown

### Dashboard Analytics
- **Bridge Statistics**: Total volume, transaction count, success rate
- **Fee Savings**: Calculate total savings from tier discounts
- **Historical Data**: Access to complete transaction history
- **Progress Tracking**: Visual progress towards next tier

### Bridge Enhancements
- **Dynamic Fee Calculation**: Real-time fee calculation with tier discounts
- **Amount Validation**: Enforce tier-based bridge limits
- **Enhanced UX**: Premium users get priority indicators
- **Advanced Tracking**: Detailed transaction monitoring

### Security Features
- **Contract Validation**: Verify token contract addresses
- **Balance Verification**: Ensure sufficient balance before bridging
- **Network Validation**: Confirm correct network connection
- **Transaction Monitoring**: Track bridge completion status

## 📱 Pages Overview

### `/` - Home Page
Redirects to bridge page for immediate access

### `/bridge/usdc/eth-base` - Bridge Page
Main bridging interface with:
- Network selection (Sepolia → Base Sepolia)
- Token selection (USDC)
- Amount input with balance display
- Tier-specific limits and discounts
- Real-time transaction status
- Bridge history sidebar

### `/dashboard` - Dashboard Page
Comprehensive analytics dashboard featuring:
- NODE token status and tier display
- Bridge analytics (for tier holders)
- Benefit comparison
- Tier progress tracking
- Historical data access

### `/instructions` - Instructions Page
Step-by-step guide covering:
- How to get testnet tokens
- Bridge usage instructions
- Important notes and requirements
- Direct links to faucets

## 🔧 Environment & Configuration

### Supported Networks
- **Source**: Ethereum Sepolia (Chain ID: 11155111)
- **Destination**: Base Sepolia (Chain ID: 84532)
- **NODE Token**: Ethereum Mainnet (configurable for testnet)

## 🛠 Development

### Project Structure
```
├── app/                    # Next.js app router pages
│   ├── bridge/            # Bridge interface
│   ├── dashboard/         # Analytics dashboard
│   └── instructions/      # User guide
├── components/            # React components
│   ├── bridge/           # Bridge-specific components
│   ├── dashboard/        # Dashboard components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── node-service.ts   # NODE token service
│   ├── node-token.ts     # Token configuration
│   └── constants.ts      # App constants
└── abi/                  # Smart contract ABIs
```

### Key Technologies
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Web3**: Wagmi v2, RainbowKit v2, Viem v2
- **State Management**: Zustand
- **TypeScript**: Full type safety
- **Icons**: Lucide React

## 🔐 Security Considerations

### Smart Contract Security
- Balance checks before transactions
- Proper error handling for failed transactions

### Frontend Security
- Input validation and sanitization
- Secure external link handling (`rel="noopener noreferrer"`)
- Protected routes requiring wallet connection
- Client-side balance verification

### Data Privacy
- Analytics stored locally in browser storage
- No sensitive data transmitted to external services
- Wallet addresses handled securely

## 🚨 Important Notes

### Testnet Only
This is a **testnet-only** bridge for demonstration purposes:
- Uses Sepolia and Base Sepolia networks
- Bridges TestUSDC tokens only
- $NODE tier system uses USDC for testing
- **Do not use real mainnet tokens**

### Network Requirements
- Must be connected to Ethereum Sepolia to bridge
- Requires sufficient Sepolia ETH for gas fees
- Automatic network validation and warnings

### Rate Limits
- Tier-based bridge amount limits
- No transaction frequency limits currently implemented
- Future versions may include rate limiting

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Support

For issues, questions, or contributions:
1. Check existing issues in the repository
2. Create a new issue with detailed description
3. Include wallet address and transaction hashes for bridge issues
4. Specify your NODE tier for tier-related questions


**Built for the Web3 community.**