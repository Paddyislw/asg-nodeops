export const ERC20_ABI = [
  { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "owner", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "allowance", stateMutability: "view", inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "value", type: "uint256" }], outputs: [{ type: "bool" }] },
] as const;

export const CCTP_TOKEN_MESSENGER_ABI = [
  {
    type: "function",
    name: "depositForBurn",
    stateMutability: "nonpayable",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "destinationDomain", type: "uint32" },
      { name: "mintRecipient", type: "bytes32" },
      { name: "burnToken", type: "address" }
    ],
    outputs: [{ name: "nonce", type: "uint64" }],
  },
  {
    type: "event",
    name: "DepositForBurn",
    inputs: [
      { name: "nonce", type: "uint64", indexed: true },
      { name: "burnToken", type: "address", indexed: true },
      { name: "amount", type: "uint256" },
      { name: "depositor", type: "address", indexed: true },
      { name: "mintRecipient", type: "bytes32" },
      { name: "destinationDomain", type: "uint32" },
      { name: "destinationTokenMessenger", type: "bytes32" },
      { name: "destinationCaller", type: "bytes32" }
    ]
  }
] as const;

export const CCTP_MESSAGE_TRANSMITTER_ABI = [
  { type: "function", name: "usedNonces", stateMutability: "view", inputs: [{ name: "nonce", type: "bytes32" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "receiveMessage", stateMutability: "nonpayable", inputs: [{ name: "message", type: "bytes" }, { name: "attestation", type: "bytes" }], outputs: [{ type: "bool" }] },
  {
    type: "event",
    name: "MessageReceived",
    inputs: [
      { name: "caller", type: "address", indexed: true },
      { name: "sourceDomain", type: "uint32" },
      { name: "nonce", type: "uint64", indexed: true },
      { name: "sender", type: "bytes32" },
      { name: "messageBody", type: "bytes" }
    ]
  }
] as const;

export const BRIDGE_ABI = CCTP_TOKEN_MESSENGER_ABI;
