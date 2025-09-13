export function WizardHeader({ step }: { step: number }) {
  const steps = ["Chains", "Token", "Review", "Result"];
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        {steps.map((label, idx) => {
          const n = idx + 1;
          const active = n === step;
          const done = n < step;
          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`size-8 grid place-items-center rounded-full border ${
                  done
                    ? "bg-[#eaf740] text-black border-[#eaf740]"
                    : active
                    ? "border-[#eaf740]"
                    : "border-white/20"
                }`}
              >
                {done ? "✓" : n}
              </div>
              <span
                className={`text-sm ${
                  active ? "text-[#eaf740]" : "text-white/60"
                }`}
              >
                {label}
              </span>
              {n !== steps.length && (
                <div className="w-8 border-t border-white/20" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
