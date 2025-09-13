import { BRIDGE_CHAINS } from "@/lib/constants";

export function ChainPicker({
  label,
  value,
  onChange,
  exclude,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  exclude?: number;
}) {
  const CHAINS = Object.values(BRIDGE_CHAINS);
  return (
    <div>
      <label className="mb-1 block text-sm text-white/70">{label} Chain</label>
      <select
        className="w-full rounded-xl2 border border-white/10 bg-black/40 px-3 py-2"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {CHAINS.filter((c) => c.id !== exclude).map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
