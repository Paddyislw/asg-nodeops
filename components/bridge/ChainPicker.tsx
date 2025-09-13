"use client"

import { BRIDGE_CHAINS } from "@/lib/constants"

export function ChainPicker({
  label,
  type,
}: {
  label: string
  type: "from" | "to"
}) {
  const chain = type === "from" ? BRIDGE_CHAINS.sepolia : BRIDGE_CHAINS.baseSepolia

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-300">{label} Chain</label>

      <div className="grid gap-3">
        <div className="w-full p-4 rounded-xl border shadow-sm text-left border-slate-600/50 bg-slate-700/30 hover:border-slate-500/50 hover:bg-slate-600/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <div>
                <div className="font-medium text-white">{chain.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
