import { TOKENS } from "@/lib/constants";
import { Address } from "viem";

export function TokenPicker({
  chainId,
  value,
  onChange,
}: {
  chainId: number;
  value?: Address;
  onChange: (a: Address) => void;
}) {
  const tokens = TOKENS[chainId] || [];
  return (
    <div>
      <label className="mb-1 block text-sm text-white/70">Token</label>
      <select
        className="w-full rounded-xl2 border border-white/10 bg-black/40 px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value as Address)}
      >
        {tokens.map((t) => (
          <option key={t.address} value={t.address}>
            {t.symbol} — {t.address.slice(0, 6)}…{t.address.slice(-4)}
          </option>
        ))}
      </select>
    </div>
  );
}
