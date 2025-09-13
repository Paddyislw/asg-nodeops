import { type Address, type Hash, keccak256, toHex, pad } from "viem";
import {
  writeContract,
  waitForTransactionReceipt,
  readContract,
} from "wagmi/actions";
import { config } from "@/lib/wagmi";
import { CCTP_TOKEN_MESSENGER_ABI, CCTP_MESSAGE_TRANSMITTER_ABI, ERC20_ABI } from "@/abi/bridge-abi";
import {
  CCTP_TOKEN_MESSENGER_CONTRACTS,
  CCTP_MESSAGE_TRANSMITTER_CONTRACTS,
  CCTP_DOMAIN_IDS,
  CCTP_USDC_CONTRACTS,
  CCTPBridgeStatus,
} from "@/lib/contracts";
import { parseAmount } from "@/lib/helper";

export interface BridgeParams {
  fromChainId: number;
  toChainId: number;
  token: Address;
  amount: string;
  recipient: Address;
  decimals: number;
}

export interface BridgeResult {
  txHash: Hash;
  nonce: bigint;
  bridgeId: string; // will be messageHash
}

export class BridgeService {
  static async initiateBridge(params: BridgeParams): Promise<BridgeResult> {
    const { fromChainId, toChainId, token, amount, recipient, decimals } =
      params;

    console.log('🚀 Starting bridge transaction');
    console.log('Bridge params:', { fromChainId, toChainId, token, amount, recipient });

    const tokenMessenger = CCTP_TOKEN_MESSENGER_CONTRACTS[fromChainId];
    console.log('TokenMessenger address:', tokenMessenger);

    if (!tokenMessenger) {
      throw new Error(
        `CCTP TokenMessenger contract not found for chain ${fromChainId}`
      );
    }

    const usdcAddress = CCTP_USDC_CONTRACTS[fromChainId];
    console.log('USDC address for chain:', usdcAddress);

    if (!usdcAddress || token.toLowerCase() !== usdcAddress.toLowerCase()) {
      throw new Error("CCTP only supports USDC transfers");
    }

    const destinationDomain = CCTP_DOMAIN_IDS[toChainId];
    console.log('Destination domain:', destinationDomain);

    if (destinationDomain === undefined) {
      throw new Error(
        `CCTP domain not found for destination chain ${toChainId}`
      );
    }

    const amountWei = parseAmount(amount, decimals);
    console.log('Amount in wei:', amountWei.toString());

    try {
      console.log('📝 Step 1: Approving USDC spend');
      // STEP 1: APPROVAL
      const approveTx = await writeContract(config, {
        abi: ERC20_ABI,
        address: token,
        functionName: "approve",
        args: [tokenMessenger, amountWei],
        chainId: fromChainId as any,
      });
      console.log('✅ Approval tx hash:', approveTx);

      // Wait for approval to be mined
      console.log('⏳ Waiting for approval confirmation...');
      await waitForTransactionReceipt(config, {
        hash: approveTx,
        chainId: fromChainId as any,
        timeout: 60_000,
      });
      console.log('✅ Approval confirmed');

      console.log('🔥 Step 2: Calling depositForBurn');
      // STEP 2: DepositForBurn
      const mintRecipient = pad(recipient, { size: 32 });
      console.log('Recipient (bytes32):', mintRecipient);

      const bridgeTx = await writeContract(config, {
        abi: CCTP_TOKEN_MESSENGER_ABI,
        address: tokenMessenger,
        functionName: "depositForBurn",
        args: [amountWei, destinationDomain, mintRecipient, token],
        chainId: fromChainId as any,
      });
      console.log('✅ DepositForBurn tx hash:', bridgeTx);

      // STEP 3: Wait for receipt
      console.log('⏳ Waiting for transaction confirmation...');
      const receipt = await waitForTransactionReceipt(config, {
        hash: bridgeTx,
        chainId: fromChainId as any,
        timeout: 60_000,
      });
      console.log('✅ Transaction confirmed');

      if (receipt.status === "reverted") {
        throw new Error("depositForBurn transaction reverted");
      }

      // Extract messageHash from MessageSent event
      console.log('🔍 Extracting messageHash from logs...');
      const { nonce, messageHash } = this.extractMessageHashFromLogs(
        receipt.logs
      );
      console.log('✅ Bridge initiated successfully!');
      console.log('Nonce:', nonce.toString());
      console.log('Message hash:', messageHash);

      return {
        txHash: bridgeTx,
        nonce,
        bridgeId: messageHash, // use messageHash for Circle API
      };
    } catch (error) {
      console.error('❌ Bridge transaction failed:', error);
      throw error;
    }
  }

  static async getBridgeStatus(
    messageHash: string
  ): Promise<CCTPBridgeStatus> {
    try {
      console.log('🔍 Checking bridge status for:', messageHash);
      const baseUrl = "https://iris-api-sandbox.circle.com";
      const url = `${baseUrl}/v1/attestations/${messageHash}`;
      console.log('Checking Circle API:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('📝 Attestation not found yet, still pending');
          return CCTPBridgeStatus.PENDING;
        }
        console.log(`⚠️ HTTP ${response.status}: ${response.statusText}`);
        return CCTPBridgeStatus.PENDING;
      }

      const data = await response.json();
      console.log('Circle API response:', data);

      // Handle different Circle API response statuses
      if (data.status) {
        switch (data.status.toLowerCase()) {
          case 'complete':
          case 'confirmed':
            console.log('✅ Bridge completed!');
            return CCTPBridgeStatus.COMPLETED;
          
          case 'pending_confirmations':
          case 'pending':
            console.log('⏳ Bridge still pending...');
            return CCTPBridgeStatus.PENDING;
            
          default:
            console.log(`📊 Unknown status: ${data.status}, treating as pending`);
            return CCTPBridgeStatus.PENDING;
        }
      }

      if (data.attestation) {
        console.log('✅ Attestation available!');
        return CCTPBridgeStatus.COMPLETED;
      }

      return CCTPBridgeStatus.PENDING;

    } catch (error) {
      console.error('❌ Status check failed:', error);
      return CCTPBridgeStatus.PENDING;
    }
  }

  static async pollBridgeStatus(
    messageHash: string,
    maxAttempts: number = 60,
    intervalMs: number = 10000
  ): Promise<CCTPBridgeStatus> {
    console.log(`🔄 Starting to poll bridge status (max ${maxAttempts} attempts)`);
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`🔄 Polling attempt ${attempt}/${maxAttempts}`);
      const status = await this.getBridgeStatus(messageHash);
      
      if (status === CCTPBridgeStatus.COMPLETED || status === CCTPBridgeStatus.FAILED) {
        return status;
      }
      
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    }
    
    console.log('⏰ Polling timeout reached, bridge still pending');
    return CCTPBridgeStatus.PENDING;
  }

  static async getAttestation(
    messageHash: string
  ): Promise<string | null> {
    try {
      const baseUrl = "https://iris-api-sandbox.circle.com";
      const url = `${baseUrl}/v1/attestations/${messageHash}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.attestation || null;
      
    } catch (error) {
      return null;
    }
  }

  static async completeBridge(
    toChainId: number,
    message: string,
    attestation: string
  ): Promise<Hash> {
    try {
      console.log('🎯 Completing bridge on destination chain:', toChainId);
      const messageTransmitter = CCTP_MESSAGE_TRANSMITTER_CONTRACTS[toChainId];
      console.log('MessageTransmitter address:', messageTransmitter);
      
      if (!messageTransmitter) {
        throw new Error(`MessageTransmitter contract not found for chain ${toChainId}`);
      }

      const completeTx = await writeContract(config, {
        abi: CCTP_MESSAGE_TRANSMITTER_ABI,
        address: messageTransmitter,
        functionName: "receiveMessage",
        args: [message as `0x${string}`, attestation as `0x${string}`],
        chainId: toChainId as any,
      });
      console.log('✅ Complete bridge tx hash:', completeTx);

      // Wait for completion
      console.log('⏳ Waiting for completion confirmation...');
      const receipt = await waitForTransactionReceipt(config, {
        hash: completeTx,
        chainId: toChainId as any,
        timeout: 60_000,
      });
      console.log('✅ Bridge completion confirmed');

      if (receipt.status === "reverted") {
        throw new Error("receiveMessage transaction reverted");
      }

      console.log('🎉 Bridge completion successful!');
      return completeTx;
      
    } catch (error) {
      console.error('❌ Bridge completion failed:', error);
      throw error;
    }
  }

  static async getTokenBalance(
    chainId: number,
    token: Address,
    user: Address
  ): Promise<bigint> {
    const balance = await readContract(config, {
      abi: ERC20_ABI,
      address: token,
      functionName: "balanceOf",
      args: [user],
      chainId: chainId as any,
    });
    return balance as bigint;
  }

  static async getTokenAllowance(
    chainId: number,
    token: Address,
    user: Address
  ): Promise<bigint> {
    const tokenMessenger = CCTP_TOKEN_MESSENGER_CONTRACTS[chainId];
    const allowance = await readContract(config, {
      abi: ERC20_ABI,
      address: token,
      functionName: "allowance",
      args: [user, tokenMessenger!],
      chainId: chainId as any,
    });
    return allowance as bigint;
  }

  private static extractMessageHashFromLogs(logs: any[]): {
    nonce: bigint;
    messageHash: string;
  } {
    console.log('🔍 Looking for MessageSent event in logs...');
    // Look for MessageSent event, not DepositForBurn
    const messageSentSig = "MessageSent(bytes)";
    const messageSentHash = keccak256(toHex(messageSentSig));

    for (const log of logs) {
      if (log.topics?.[0] === messageSentHash) {
        console.log('📨 Found MessageSent log');
        try {
          const logData = log.data as `0x${string}`;
          
          // Remove the '0x' prefix
          const dataWithoutPrefix = logData.slice(2);
          
          const lengthHex = dataWithoutPrefix.slice(64, 128);
          const length = parseInt(lengthHex, 16);
          const messageHex = dataWithoutPrefix.slice(128, 128 + length * 2);
          const messageBytes = `0x${messageHex}` as `0x${string}`;
          const messageHash = keccak256(messageBytes);

          // For nonce, we need to look at DepositForBurn event
          const depositForBurnSig = "DepositForBurn(uint64,address,uint256,address,bytes32,uint32,bytes32,bytes32)";
          const depositForBurnHash = keccak256(toHex(depositForBurnSig));
          
          let nonce = BigInt(Date.now());
          
          for (const depositLog of logs) {
            if (depositLog.topics?.[0] === depositForBurnHash) {
              nonce = BigInt(depositLog.topics[1]);
              console.log('✅ Found nonce from DepositForBurn:', nonce.toString());
              break;
            }
          }

          console.log('✅ Extracted messageHash:', messageHash);
          return { nonce, messageHash };
          
        } catch (error) {
          // Skip this log if decoding fails
        }
      }
    }

    
    // Fallback values if events not found
    return {
      nonce: BigInt(Date.now()),
      messageHash: keccak256(toHex("fallback")),
    };
  }
}