import { BRIDGE_HISTORY_ABI } from "@/abi/birdge-history-abi";
import { BRIDGE_TRACKER_CONTRACTS } from "@/lib/contracts";
import { parseAmount } from "@/lib/helper";
import { config } from "@/lib/wagmi";
import { BridgeParams, BridgeResult, BridgeStatus, BridgeTransactionWithUser, GlobalAnalytics, GlobalAnalyticsSummary, PaginatedAnalytics } from "@/types/bridge";
import { Address, type Hash } from "viem";

import {
  writeContract,
  waitForTransactionReceipt,
  readContract,
} from "wagmi/actions";

export class BridgeHistory {
  /**
   * Test if contract is accessible and get basic info
   */
  static async testContract(
    chainId: number,
    address: Address
  ): Promise<{
    accessible: boolean;
    name?: string;
    version?: string;
    userBridgeCount?: number;
    error?: string;
  }> {
    const trackerAddress =
      BRIDGE_TRACKER_CONTRACTS[
        chainId as keyof typeof BRIDGE_TRACKER_CONTRACTS
      ];

    console.log(`🧪 [TEST CONTRACT] Starting test for chain ${chainId}`);
    console.log(`🧪 [TEST CONTRACT] Contract address: ${trackerAddress}`);
    console.log(`🧪 [TEST CONTRACT] User address: ${address}`);

    if (!trackerAddress) {
      console.log(
        `❌ [TEST CONTRACT] No contract address configured for chain ${chainId}`
      );
      return { accessible: false, error: "No contract address for chain" };
    }

    try {
      console.log(`🧪 [TEST CONTRACT] Calling NAME() function...`);
      const name = (await readContract(config, {
        abi: BRIDGE_HISTORY_ABI,
        address: trackerAddress,
        functionName: "NAME",
        chainId: chainId as any,
      })) as string;

      console.log(`✅ [TEST CONTRACT] Contract NAME: ${name}`);

      console.log(`🧪 [TEST CONTRACT] Calling VERSION() function...`);
      const version = (await readContract(config, {
        abi: BRIDGE_HISTORY_ABI,
        address: trackerAddress,
        functionName: "VERSION",
        chainId: chainId as any,
      })) as string;

      console.log(`✅ [TEST CONTRACT] Contract VERSION: ${version}`);

      console.log(
        `🧪 [TEST CONTRACT] Calling getUserBridgeCount() function...`
      );
      const userBridgeCount = (await readContract(config, {
        abi: BRIDGE_HISTORY_ABI,
        address: trackerAddress,
        functionName: "getUserBridgeCount",
        args: [address],
        chainId: chainId as any,
      })) as bigint;

      console.log(
        `✅ [TEST CONTRACT] User bridge count: ${userBridgeCount.toString()}`
      );

      return {
        accessible: true,
        name,
        version,
        userBridgeCount: Number(userBridgeCount),
      };
    } catch (error) {
      console.error(
        `❌ [TEST CONTRACT] Contract test failed on chain ${chainId}:`,
        error
      );

      // Log specific error details
      if (error instanceof Error) {
        console.error(`❌ [TEST CONTRACT] Error name: ${error.name}`);
        console.error(`❌ [TEST CONTRACT] Error message: ${error.message}`);
      }

      return {
        accessible: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Record a bridge transaction in the smart contract
   */
  static async recordBridge(
    chainId: number,
    params: BridgeParams,
    result: BridgeResult,
    userAddress: Address
  ): Promise<Hash> {
    console.log(
      `🔥 [RECORD BRIDGE] ==================== STARTING BRIDGE RECORDING ====================`
    );
    console.log(`🔥 [RECORD BRIDGE] Chain ID: ${chainId}`);
    console.log(`🔥 [RECORD BRIDGE] User Address: ${userAddress}`);

    const trackerAddress =
      BRIDGE_TRACKER_CONTRACTS[
        chainId as keyof typeof BRIDGE_TRACKER_CONTRACTS
      ];

    if (!trackerAddress) {
      console.error(
        `❌ [RECORD BRIDGE] No bridge tracker contract deployed on chain ${chainId}`
      );
      throw new Error(
        `No bridge tracker contract deployed on chain ${chainId}`
      );
    }

    console.log(`🔥 [RECORD BRIDGE] Contract address: ${trackerAddress}`);

    try {
      // Convert amount with proper decimals
      console.log(
        `🔥 [RECORD BRIDGE] Converting amount: ${params.amount} with decimals: ${params.decimals}`
      );
      const amountWei = parseAmount(params.amount, params.decimals);
      console.log(`🔥 [RECORD BRIDGE] Amount in wei: ${amountWei.toString()}`);

      const contractParams = {
        messageHash: result.bridgeId,
        amount: amountWei.toString(),
        token: params.token,
        fromChain: params.fromChainId,
        toChain: params.toChainId,
        recipient: params.recipient,
        nonce: result.nonce.toString(),
        txHash: result.txHash,
      };
      console.log(`🔥 [RECORD BRIDGE] Contract parameters:`, contractParams);

      // Validate parameters
      console.log(`🔥 [RECORD BRIDGE] Validating parameters...`);
      if (!result.bridgeId || result.bridgeId === "0x") {
        console.error(
          `❌ [RECORD BRIDGE] Invalid messageHash: ${result.bridgeId}`
        );
        throw new Error("Invalid messageHash");
      }

      if (amountWei <= BigInt(0)) {
        console.error(`❌ [RECORD BRIDGE] Invalid amount: ${amountWei}`);
        throw new Error("Invalid amount");
      }

      console.log(
        `🔥 [RECORD BRIDGE] All parameters valid, calling writeContract...`
      );

      // Make the contract call
      const recordTx = await writeContract(config, {
        abi: BRIDGE_HISTORY_ABI,
        address: trackerAddress,
        functionName: "recordBridge",
        args: [
          result.bridgeId as Hash, // messageHash (bytes32)
          amountWei, // amount (uint256)
          params.token, // token (address)
          params.fromChainId, // fromChain (uint32)
          params.toChainId, // toChain (uint32)
          params.recipient, // recipient (address)
          result.nonce, // nonce (uint64)
          result.txHash, // txHash (string)
        ],
        chainId: chainId as any,
      });

      console.log(
        `✅ [RECORD BRIDGE] Record transaction submitted! Hash: ${recordTx}`
      );

      // Wait for confirmation
      console.log(`🔥 [RECORD BRIDGE] Waiting for transaction confirmation...`);
      const receipt = await waitForTransactionReceipt(config, {
        hash: recordTx,
        chainId: chainId as any,
        timeout: 60_000,
      });

      console.log(`🔥 [RECORD BRIDGE] Transaction receipt received:`, {
        status: receipt.status,
        gasUsed: receipt.gasUsed?.toString(),
        blockNumber: receipt.blockNumber?.toString(),
      });

      if (receipt.status === "reverted") {
        console.error(`❌ [RECORD BRIDGE] Transaction was reverted!`);
        throw new Error("Record transaction was reverted");
      }

      console.log(
        `✅ [RECORD BRIDGE] Bridge recorded in contract successfully!`
      );
      console.log(
        `🔥 [RECORD BRIDGE] ==================== BRIDGE RECORDING COMPLETE ====================`
      );
      return recordTx;
    } catch (error) {
      console.error(
        `❌ [RECORD BRIDGE] ==================== BRIDGE RECORDING FAILED ====================`
      );
      console.error(
        `❌ [RECORD BRIDGE] Failed to record bridge in contract:`,
        error
      );
      console.error(`❌ [RECORD BRIDGE] Error details:`, {
        chainId,
        trackerAddress,
        messageHash: result.bridgeId,
        amount: params.amount,
        userAddress,
        errorName: error instanceof Error ? error.name : "Unknown",
        errorMessage: error instanceof Error ? error.message : String(error),
      });

      // Log the full error for debugging
      if (error instanceof Error && error.stack) {
        console.error(`❌ [RECORD BRIDGE] Error stack:`, error.stack);
      }

      throw error;
    }
  }

  /**
   * Update bridge status
   */
  static async updateBridgeStatus(
    chainId: number,
    messageHash: Hash,
    status: BridgeStatus
  ): Promise<Hash> {
    console.log(
      `🔄 [UPDATE STATUS] Updating bridge status for ${messageHash} to ${BridgeStatus[status]}`
    );

    const trackerAddress =
      BRIDGE_TRACKER_CONTRACTS[
        chainId as keyof typeof BRIDGE_TRACKER_CONTRACTS
      ];

    if (!trackerAddress) {
      throw new Error(
        `No bridge tracker contract deployed on chain ${chainId}`
      );
    }

    try {
      const updateTx = await writeContract(config, {
        abi: BRIDGE_HISTORY_ABI,
        address: trackerAddress,
        functionName: "updateBridgeStatus",
        args: [messageHash, status],
        chainId: chainId as any,
      });

      console.log(
        `🔄 [UPDATE STATUS] Update transaction submitted: ${updateTx}`
      );

      const receipt = await waitForTransactionReceipt(config, {
        hash: updateTx,
        chainId: chainId as any,
        timeout: 60_000,
      });

      if (receipt.status === "reverted") {
        throw new Error("Update status transaction was reverted");
      }

      console.log(
        `✅ [UPDATE STATUS] Bridge status updated to ${BridgeStatus[status]}`
      );
      return updateTx;
    } catch (error) {
      console.error(
        `❌ [UPDATE STATUS] Failed to update bridge status:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get bridge count for a user
   */
  static async getUserBridgeCount(
    chainId: number,
    userAddress: Address
  ): Promise<number> {
    console.log(
      `🔍 [GET COUNT] Getting bridge count for ${userAddress} on chain ${chainId}`
    );

    const trackerAddress =
      BRIDGE_TRACKER_CONTRACTS[
        chainId as keyof typeof BRIDGE_TRACKER_CONTRACTS
      ];

    if (!trackerAddress) {
      console.log(`⚠️ [GET COUNT] No contract address for chain ${chainId}`);
      return 0;
    }

    try {
      const count = (await readContract(config, {
        abi: BRIDGE_HISTORY_ABI,
        address: trackerAddress,
        functionName: "getUserBridgeCount",
        args: [userAddress],
        chainId: chainId as any,
      })) as bigint;

      console.log(
        `✅ [GET COUNT] Bridge count for chain ${chainId}: ${count.toString()}`
      );
      return Number(count);
    } catch (error) {
      console.error(
        `❌ [GET COUNT] Error getting bridge count from chain ${chainId}:`,
        error
      );
      return 0;
    }
  }

  /**
   * Get all user bridges
   */
  static async getUserBridges(
    chainId: number,
    userAddress: Address
  ): Promise<any[]> {
    console.log(
      `🔍 [GET BRIDGES] Getting all bridges for ${userAddress} on chain ${chainId}`
    );

    const trackerAddress =
      BRIDGE_TRACKER_CONTRACTS[
        chainId as keyof typeof BRIDGE_TRACKER_CONTRACTS
      ];

    if (!trackerAddress) {
      return [];
    }

    try {
      const bridges = await readContract(config, {
        abi: BRIDGE_HISTORY_ABI,
        address: trackerAddress,
        functionName: "getUserBridges",
        args: [userAddress],
        chainId: chainId as any,
      });

      console.log(
        `✅ [GET BRIDGES] Found ${
          (bridges as any[]).length
        } bridges on chain ${chainId}`
      );
      return bridges as any[];
    } catch (error) {
      console.error(
        `❌ [GET BRIDGES] Error getting user bridges from chain ${chainId}:`,
        error
      );
      return [];
    }
  }

  /**
   * Get total bridge count across both chains
   */
  static async getTotalUserBridgeCount(userAddress: Address): Promise<number> {
    console.log(
      `🔍 [TOTAL COUNT] Getting total bridge count for ${userAddress} across all chains`
    );

    let totalCount = 0;

    // Get count from both chains
    for (const [chainId, contractAddress] of Object.entries(
      BRIDGE_TRACKER_CONTRACTS
    )) {
      if (contractAddress) {
        try {
          const count = await this.getUserBridgeCount(
            parseInt(chainId),
            userAddress
          );
          totalCount += count;
        } catch (error) {
          console.warn(
            `⚠️ [TOTAL COUNT] Failed to get count from chain ${chainId}:`,
            error
          );
        }
      }
    }

    console.log(`✅ [TOTAL COUNT] Total bridge count: ${totalCount}`);
    return totalCount;
  }

  // ========== NEW GLOBAL ANALYTICS FUNCTIONS ==========

  /**
   * Get comprehensive global bridge analytics
   */
  static async getBridgeAnalytics(chainId: number): Promise<GlobalAnalytics> {
    console.log(
      `🔍 [GLOBAL ANALYTICS] Getting global bridge analytics for chain ${chainId}`
    );

    const trackerAddress =
      BRIDGE_TRACKER_CONTRACTS[
        chainId as keyof typeof BRIDGE_TRACKER_CONTRACTS
      ];

    if (!trackerAddress) {
      throw new Error(
        `No bridge tracker contract deployed on chain ${chainId}`
      );
    }

    try {
      const result = (await readContract(config, {
        abi: BRIDGE_HISTORY_ABI,
        address: trackerAddress,
        functionName: "getBridgeAnalytics",
        chainId: chainId as any,
      })) as [bigint, bigint, any[]];

      const [totalAmount, totalTxns, txns] = result;

      const formattedTxns: BridgeTransactionWithUser[] = txns.map(
        (tx: any) => ({
          user: tx.user,
          messageHash: tx.messageHash,
          amount: tx.amount,
          token: tx.token,
          fromChain: Number(tx.fromChain),
          toChain: Number(tx.toChain),
          recipient: tx.recipient,
          timestamp: tx.timestamp,
          nonce: tx.nonce,
          status: tx.status as BridgeStatus,
          txHash: tx.txHash,
        })
      );

      console.log(
        `✅ [GLOBAL ANALYTICS] Retrieved ${
          formattedTxns.length
        } transactions, total amount: ${totalAmount.toString()}`
      );

      return {
        totalAmount,
        totalTxns: Number(totalTxns),
        txns: formattedTxns,
      };
    } catch (error) {
      console.error(
        `❌ [GLOBAL ANALYTICS] Error getting global analytics from chain ${chainId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get global analytics summary (gas efficient)
   */
  static async getGlobalAnalyticsSummary(
    chainId: number
  ): Promise<GlobalAnalyticsSummary> {
    console.log(
      `🔍 [GLOBAL SUMMARY] Getting global analytics summary for chain ${chainId}`
    );

    const trackerAddress =
      BRIDGE_TRACKER_CONTRACTS[
        chainId as keyof typeof BRIDGE_TRACKER_CONTRACTS
      ];

    if (!trackerAddress) {
      throw new Error(
        `No bridge tracker contract deployed on chain ${chainId}`
      );
    }

    try {
      const result = (await readContract(config, {
        abi: BRIDGE_HISTORY_ABI,
        address: trackerAddress,
        functionName: "getGlobalAnalyticsSummary",
        chainId: chainId as any,
      })) as [bigint, bigint, bigint];

      const [totalAmount, totalTxns, totalUsers] = result;

      console.log(
        `✅ [GLOBAL SUMMARY] Total amount: ${totalAmount.toString()}, transactions: ${totalTxns.toString()}, users: ${totalUsers.toString()}`
      );

      return {
        totalAmount,
        totalTxns: Number(totalTxns),
        totalUsers: Number(totalUsers),
      };
    } catch (error) {
      console.error(
        `❌ [GLOBAL SUMMARY] Error getting global summary from chain ${chainId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get paginated bridge analytics
   */
  static async getPaginatedBridgeAnalytics(
    chainId: number,
    offset: number,
    limit: number
  ): Promise<PaginatedAnalytics> {
    console.log(
      `🔍 [PAGINATED ANALYTICS] Getting paginated analytics for chain ${chainId}, offset: ${offset}, limit: ${limit}`
    );

    const trackerAddress =
      BRIDGE_TRACKER_CONTRACTS[
        chainId as keyof typeof BRIDGE_TRACKER_CONTRACTS
      ];

    if (!trackerAddress) {
      throw new Error(
        `No bridge tracker contract deployed on chain ${chainId}`
      );
    }

    try {
      const result = (await readContract(config, {
        abi: BRIDGE_HISTORY_ABI,
        address: trackerAddress,
        functionName: "getPaginatedBridgeAnalytics",
        args: [BigInt(offset), BigInt(limit)],
        chainId: chainId as any,
      })) as [bigint, bigint, any[], boolean];

      const [totalAmount, totalTxns, txns, hasMore] = result;

      const formattedTxns: BridgeTransactionWithUser[] = txns.map(
        (tx: any) => ({
          user: tx.user,
          messageHash: tx.messageHash,
          amount: tx.amount,
          token: tx.token,
          fromChain: Number(tx.fromChain),
          toChain: Number(tx.toChain),
          recipient: tx.recipient,
          timestamp: tx.timestamp,
          nonce: tx.nonce,
          status: tx.status as BridgeStatus,
          txHash: tx.txHash,
        })
      );

      console.log(
        `✅ [PAGINATED ANALYTICS] Retrieved ${formattedTxns.length} transactions, hasMore: ${hasMore}`
      );

      return {
        totalAmount,
        totalTxns: Number(totalTxns),
        txns: formattedTxns,
        hasMore,
      };
    } catch (error) {
      console.error(
        `❌ [PAGINATED ANALYTICS] Error getting paginated analytics from chain ${chainId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get all users who have made bridge transactions
   */
  static async getAllUsers(chainId: number): Promise<Address[]> {
    console.log(`🔍 [ALL USERS] Getting all users for chain ${chainId}`);

    const trackerAddress =
      BRIDGE_TRACKER_CONTRACTS[
        chainId as keyof typeof BRIDGE_TRACKER_CONTRACTS
      ];

    if (!trackerAddress) {
      throw new Error(
        `No bridge tracker contract deployed on chain ${chainId}`
      );
    }

    try {
      const users = (await readContract(config, {
        abi: BRIDGE_HISTORY_ABI,
        address: trackerAddress,
        functionName: "getAllUsers",
        chainId: chainId as any,
      })) as Address[];

      console.log(`✅ [ALL USERS] Retrieved ${users.length} users`);
      return users;
    } catch (error) {
      console.error(
        `❌ [ALL USERS] Error getting all users from chain ${chainId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get total number of unique users
   */
  static async getTotalUsers(chainId: number): Promise<number> {
    console.log(
      `🔍 [TOTAL USERS] Getting total users count for chain ${chainId}`
    );

    const trackerAddress =
      BRIDGE_TRACKER_CONTRACTS[
        chainId as keyof typeof BRIDGE_TRACKER_CONTRACTS
      ];

    if (!trackerAddress) {
      throw new Error(
        `No bridge tracker contract deployed on chain ${chainId}`
      );
    }

    try {
      const totalUsers = (await readContract(config, {
        abi: BRIDGE_HISTORY_ABI,
        address: trackerAddress,
        functionName: "getTotalUsers",
        chainId: chainId as any,
      })) as bigint;

      console.log(`✅ [TOTAL USERS] Total users: ${totalUsers.toString()}`);
      return Number(totalUsers);
    } catch (error) {
      console.error(
        `❌ [TOTAL USERS] Error getting total users from chain ${chainId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get user stats (enhanced version)
   */
  static async getUserStats(
    chainId: number,
    userAddress: Address
  ): Promise<{
    totalBridges: number;
    completedBridges: number;
    pendingBridges: number;
    totalVolume: bigint;
    fromSepoliaVolume: bigint;
    toSepoliaVolume: bigint;
  } | null> {
    console.log(
      `🔍 [USER STATS] Getting user stats for ${userAddress} on chain ${chainId}`
    );

    const trackerAddress =
      BRIDGE_TRACKER_CONTRACTS[
        chainId as keyof typeof BRIDGE_TRACKER_CONTRACTS
      ];

    if (!trackerAddress) {
      return null;
    }

    try {
      const result = (await readContract(config, {
        abi: BRIDGE_HISTORY_ABI,
        address: trackerAddress,
        functionName: "getUserStats",
        args: [userAddress],
        chainId: chainId as any,
      })) as [bigint, bigint, bigint, bigint, bigint, bigint];

      const [
        totalBridges,
        completedBridges,
        pendingBridges,
        totalVolume,
        fromSepoliaVolume,
        toSepoliaVolume,
      ] = result;

      console.log(`✅ [USER STATS] User stats retrieved for chain ${chainId}`);

      return {
        totalBridges: Number(totalBridges),
        completedBridges: Number(completedBridges),
        pendingBridges: Number(pendingBridges),
        totalVolume,
        fromSepoliaVolume,
        toSepoliaVolume,
      };
    } catch (error) {
      console.error(
        `❌ [USER STATS] Error getting user stats from chain ${chainId}:`,
        error
      );
      return null;
    }
  }
}
