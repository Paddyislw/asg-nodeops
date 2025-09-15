import { BRIDGE_TRACKER_CONTRACTS } from "@/lib/contracts";
import { Address, Hash } from "viem";
import { BridgeHistory } from "./BirdgeHistory";
import { BridgeParams, BridgeResult, BridgeStatus, BridgeTransactionWithUser, GlobalAnalytics, GlobalAnalyticsSummary, PaginatedAnalytics } from "@/types/bridge";
import { BridgeService } from "./BridgeService";

export class BridgeManager {
  /**
   * Test all contract connections with detailed logging
   */
  static async testAllContracts(userAddress: Address): Promise<void> {
    console.log("🧪 [TEST ALL] Testing all contract connections...");

    for (const [chainId, contractAddress] of Object.entries(
      BRIDGE_TRACKER_CONTRACTS
    )) {
      console.log(
        `\n🧪 [TEST ALL] --- Testing Chain ${chainId} (${contractAddress}) ---`
      );
      const result = await BridgeHistory.testContract(
        parseInt(chainId),
        userAddress
      );

      if (result.accessible) {
        console.log(`✅ [TEST ALL] Chain ${chainId} working:`, {
          name: result.name,
          version: result.version,
          userBridgeCount: result.userBridgeCount,
        });
      } else {
        console.log(`❌ [TEST ALL] Chain ${chainId} failed:`, result.error);
      }
    }
  }

  /**
   * Bridge with automatic contract recording - THIS IS THE MAIN METHOD TO USE
   */
  static async initiateBridge(
    params: BridgeParams,
    userAddress: Address
  ): Promise<BridgeResult> {
    console.log(
      `🌉 [INITIATE BRIDGE] ==================== STARTING BRIDGE WITH CONTRACT RECORDING ====================`
    );
    console.log(`🌉 [INITIATE BRIDGE] Bridge parameters:`, params);
    console.log(`🌉 [INITIATE BRIDGE] User address: ${userAddress}`);

    let result: BridgeResult;

    try {
      // STEP 1: Initiate the actual CCTP bridge
      console.log(`🌉 [INITIATE BRIDGE] Step 1: Initiating CCTP bridge...`);
      result = await BridgeService.initiateBridge(params);
      console.log(`✅ [INITIATE BRIDGE] CCTP bridge initiated successfully!`);
      console.log(`✅ [INITIATE BRIDGE] Bridge result:`, result);
    } catch (bridgeError) {
      console.error(`❌ [INITIATE BRIDGE] CCTP bridge failed:`, bridgeError);
      throw bridgeError;
    }

    // STEP 2: Record in smart contract
    try {
      console.log(
        `🌉 [INITIATE BRIDGE] Step 2: Recording in smart contract...`
      );
      const recordTx = await BridgeHistory.recordBridge(
        params.fromChainId,
        params,
        result,
        userAddress
      );
      console.log(
        `✅ [INITIATE BRIDGE] Bridge recorded in contract successfully! Tx: ${recordTx}`
      );
    } catch (contractError) {
      console.warn(
        `⚠️ [INITIATE BRIDGE] Failed to record in contract, but bridge was successful:`,
        contractError
      );
    }

    console.log(
      `🌉 [INITIATE BRIDGE] ==================== BRIDGE WITH CONTRACT RECORDING COMPLETE ====================`
    );
    return result;
  }

  /**
   * Get user's bridge count
   */
  static async getUserBridgeCount(userAddress: Address): Promise<number> {
    return await BridgeHistory.getTotalUserBridgeCount(userAddress);
  }

  /**
   * Get all user bridges from both chains using stats
   */
  static async getAllUserBridgeStats(userAddress: Address): Promise<{
    totalStats: {
      totalBridges: number;
      completedBridges: number;
      pendingBridges: number;
      totalVolume: bigint;
    };
    sepoliaStats: any;
    baseSepoliaStats: any;
  }> {
    let totalBridges = 0;
    let totalCompleted = 0;
    let totalPending = 0;
    let totalVolume = BigInt(0);

    const sepoliaStats = await BridgeHistory.getUserStats(
      11155111,
      userAddress
    );
    const baseSepoliaStats = await BridgeHistory.getUserStats(
      84532,
      userAddress
    );

    if (sepoliaStats) {
      totalBridges += sepoliaStats.totalBridges;
      totalCompleted += sepoliaStats.completedBridges;
      totalPending += sepoliaStats.pendingBridges;
      totalVolume += sepoliaStats.totalVolume;
    }

    if (baseSepoliaStats) {
      totalBridges += baseSepoliaStats.totalBridges;
      totalCompleted += baseSepoliaStats.completedBridges;
      totalPending += baseSepoliaStats.pendingBridges;
      totalVolume += baseSepoliaStats.totalVolume;
    }

    return {
      totalStats: {
        totalBridges,
        completedBridges: totalCompleted,
        pendingBridges: totalPending,
        totalVolume,
      },
      sepoliaStats,
      baseSepoliaStats,
    };
  }

  /**
   * Update a bridge status manually
   */
  static async updateBridgeStatus(
    chainId: number,
    messageHash: Hash,
    status: BridgeStatus
  ): Promise<void> {
    await BridgeHistory.updateBridgeStatus(chainId, messageHash, status);
  }

  /**
   * Check if contracts are deployed and working
   */
  static async checkContractStatus(): Promise<{
    sepolia: boolean;
    baseSepolia: boolean;
    details: {
      sepoliaAddress: string;
      baseSepoliaAddress: string;
      sepoliaInfo?: any;
      baseSepoliaInfo?: any;
    };
  }> {
    const dummyAddress =
      "0x0000000000000000000000000000000000000000" as Address;

    console.log(`🔍 [STATUS CHECK] Checking contract status...`);
    const sepoliaTest = await BridgeHistory.testContract(
      11155111,
      dummyAddress
    );
    const baseSepoliaTest = await BridgeHistory.testContract(
      84532,
      dummyAddress
    );

    const result = {
      sepolia: sepoliaTest.accessible,
      baseSepolia: baseSepoliaTest.accessible,
      details: {
        sepoliaAddress: BRIDGE_TRACKER_CONTRACTS[11155111],
        baseSepoliaAddress: BRIDGE_TRACKER_CONTRACTS[84532],
        sepoliaInfo: sepoliaTest.accessible
          ? sepoliaTest
          : { error: sepoliaTest.error },
        baseSepoliaInfo: baseSepoliaTest.accessible
          ? baseSepoliaTest
          : { error: baseSepoliaTest.error },
      },
    };

    console.log(`🔍 [STATUS CHECK] Contract status result:`, result);
    return result;
  }

  /**
   * IMPORTANT: Manual bridge recording for existing bridge results
   */
  static async recordExistingBridge(
    chainId: number,
    params: BridgeParams,
    result: BridgeResult,
    userAddress: Address
  ): Promise<Hash> {
    console.log(`📝 [MANUAL RECORD] Manually recording existing bridge...`);
    return await BridgeHistory.recordBridge(
      chainId,
      params,
      result,
      userAddress
    );
  }

  // ========== NEW GLOBAL ANALYTICS METHODS ==========

  /**
   * Get global bridge analytics from both chains combined
   */
  static async getGlobalBridgeAnalytics(): Promise<{
    combined: {
      totalAmount: bigint;
      totalTxns: number;
      totalUsers: number;
    };
    sepolia: GlobalAnalyticsSummary | null;
    baseSepolia: GlobalAnalyticsSummary | null;
  }> {
    console.log(`🌍 [COMBINED ANALYTICS] Getting global analytics from both chains...`);

    let sepoliaSummary: GlobalAnalyticsSummary | null = null;
    let baseSepoliaSummary: GlobalAnalyticsSummary | null = null;

    try {
      sepoliaSummary = await BridgeHistory.getGlobalAnalyticsSummary(11155111);
    } catch (error) {
      console.warn(`⚠️ [COMBINED ANALYTICS] Failed to get Sepolia analytics:`, error);
    }

    try {
      baseSepoliaSummary = await BridgeHistory.getGlobalAnalyticsSummary(84532);
    } catch (error) {
      console.warn(`⚠️ [COMBINED ANALYTICS] Failed to get Base Sepolia analytics:`, error);
    }

    const combined = {
      totalAmount: (sepoliaSummary?.totalAmount || BigInt(0)) + (baseSepoliaSummary?.totalAmount || BigInt(0)),
      totalTxns: (sepoliaSummary?.totalTxns || 0) + (baseSepoliaSummary?.totalTxns || 0),
      totalUsers: Math.max(sepoliaSummary?.totalUsers || 0, baseSepoliaSummary?.totalUsers || 0), // Note: This is not accurate for unique users across chains
    };

    console.log(`✅ [COMBINED ANALYTICS] Combined stats:`, combined);

    return {
      combined,
      sepolia: sepoliaSummary,
      baseSepolia: baseSepoliaSummary,
    };
  }

  /**
   * Get paginated global analytics from a specific chain
   */
  static async getPaginatedGlobalAnalytics(
    chainId: number,
    offset: number = 0,
    limit: number = 50
  ): Promise<PaginatedAnalytics> {
    return await BridgeHistory.getPaginatedBridgeAnalytics(chainId, offset, limit);
  }

  /**
   * Get all transactions from both chains (use with caution for large datasets)
   */
  static async getAllBridgeTransactions(): Promise<{
    sepolia: BridgeTransactionWithUser[];
    baseSepolia: BridgeTransactionWithUser[];
    combined: BridgeTransactionWithUser[];
    totalAmount: bigint;
    totalTxns: number;
  }> {
    console.log(`🌍 [ALL TRANSACTIONS] Getting all bridge transactions from both chains...`);

    let sepoliaAnalytics: GlobalAnalytics | null = null;
    let baseSepoliaAnalytics: GlobalAnalytics | null = null;

    try {
      sepoliaAnalytics = await BridgeHistory.getBridgeAnalytics(11155111);
    } catch (error) {
      console.warn(`⚠️ [ALL TRANSACTIONS] Failed to get Sepolia transactions:`, error);
    }

    try {
      baseSepoliaAnalytics = await BridgeHistory.getBridgeAnalytics(84532);
    } catch (error) {
      console.warn(`⚠️ [ALL TRANSACTIONS] Failed to get Base Sepolia transactions:`, error);
    }

    const sepoliaTxns = sepoliaAnalytics?.txns || [];
    const baseSepoliaTxns = baseSepoliaAnalytics?.txns || [];
    const combined = [...sepoliaTxns, ...baseSepoliaTxns].sort((a, b) => 
      Number(b.timestamp) - Number(a.timestamp)
    );

    const result = {
      sepolia: sepoliaTxns,
      baseSepolia: baseSepoliaTxns,
      combined,
      totalAmount: (sepoliaAnalytics?.totalAmount || BigInt(0)) + (baseSepoliaAnalytics?.totalAmount || BigInt(0)),
      totalTxns: (sepoliaAnalytics?.totalTxns || 0) + (baseSepoliaAnalytics?.totalTxns || 0),
    };

    console.log(`✅ [ALL TRANSACTIONS] Retrieved ${result.totalTxns} total transactions`);
    return result;
  }

  /**
   * Get complete analytics for a specific chain
   */
  static async getChainAnalytics(chainId: number): Promise<GlobalAnalytics> {
    return await BridgeHistory.getBridgeAnalytics(chainId);
  }

  /**
   * Get analytics summary for a specific chain (gas efficient)
   */
  static async getChainAnalyticsSummary(chainId: number): Promise<GlobalAnalyticsSummary> {
    return await BridgeHistory.getGlobalAnalyticsSummary(chainId);
  }

  /**
   * Get all users from both chains
   */
  static async getAllUsersFromBothChains(): Promise<{
    sepolia: Address[];
    baseSepolia: Address[];
    uniqueUsers: Address[];
    totalUniqueUsers: number;
  }> {
    console.log(`🔍 [ALL USERS BOTH CHAINS] Getting all users from both chains...`);

    let sepoliaUsers: Address[] = [];
    let baseSepoliaUsers: Address[] = [];

    try {
      sepoliaUsers = await BridgeHistory.getAllUsers(11155111);
    } catch (error) {
      console.warn(`⚠️ [ALL USERS BOTH CHAINS] Failed to get Sepolia users:`, error);
    }

    try {
      baseSepoliaUsers = await BridgeHistory.getAllUsers(84532);
    } catch (error) {
      console.warn(`⚠️ [ALL USERS BOTH CHAINS] Failed to get Base Sepolia users:`, error);
    }

    // Get unique users across both chains
    const allUsers = [...sepoliaUsers, ...baseSepoliaUsers];
    const uniqueUsers = [...new Set(allUsers.map(addr => addr.toLowerCase()))] as Address[];

    console.log(`✅ [ALL USERS BOTH CHAINS] Found ${uniqueUsers.length} unique users across both chains`);

    return {
      sepolia: sepoliaUsers,
      baseSepolia: baseSepoliaUsers,
      uniqueUsers,
      totalUniqueUsers: uniqueUsers.length,
    };
  }
}