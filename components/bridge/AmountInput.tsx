export function AmountInput({
  value,
  onChange,
  balance,
  onMax,
}: {
  value: string;
  onChange: (v: string) => void;
  balance: string;
  onMax: () => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-white/70">Amount</label>
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.0"
          className="flex-1 rounded-xl2 border border-white/10 bg-black/40 px-3 py-2"
        />
        <button
          onClick={onMax}
          className="rounded-xl2 border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
        >
          Max
        </button>
      </div>
      <p className="mt-1 text-xs text-white/60">Balance: {balance}</p>
    </div>
  );
}
