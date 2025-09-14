"use client"

import { TOKENS } from "@/lib/constants"
import type { Address } from "viem"

export function TokenPicker({
  chainId,
  value,
  onChange,
}: {
  chainId: number
  value?: Address
  onChange: (a: Address) => void
}) {
  const tokens = TOKENS[chainId] || []

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-300">Token</label>

      <div className="grid gap-3">
        {tokens.map((token) => (
          <button
            key={token.address}
            onClick={() => onChange(token.address as Address)}
            className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
              value === token.address
                ? "border-blue-500/50 bg-blue-500/10 shadow-sm"
                : "border-slate-600/50 bg-slate-700/30 hover:border-slate-500/50 hover:bg-slate-600/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${value === token.address ? "bg-blue-500" : "bg-slate-500"}`}
                ></div>
                <div>
                  <div className="font-medium text-white">{token.symbol}</div>
                  <div className="text-xs text-slate-400 font-mono break-all">{token.address}</div>
                </div>
              </div>
              {value === token.address && (
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
