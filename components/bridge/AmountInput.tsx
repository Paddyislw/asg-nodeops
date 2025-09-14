"use client"

export function AmountInput({
  value,
  onChange,
  balance,
  onMax,
}: {
  value: string
  onChange: (v: string) => void
  balance: string
  onMax: () => void
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">Amount</label>

      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.0"
          className="w-full rounded-lg border border-border bg-input px-4 py-3.5 pr-20 text-sm font-medium text-foreground placeholder:text-muted-foreground transition-all duration-200 hover:border-accent/50 focus:border-primary"
        />

        <button
          onClick={onMax}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-all duration-200 hover:bg-accent/10 hover:border-accent/50 hover:text-accent active:scale-95"
        >
          Max
        </button>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Available Balance</span>
        <span className="font-medium text-foreground">{balance}</span>
      </div>
    </div>
  )
}
