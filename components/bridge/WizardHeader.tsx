export function WizardHeader({ step }: { step: number }) {
  const steps = [
    { label: "Chains", description: "Select networks" },
    { label: "Token", description: "Choose amount" },
    { label: "Review", description: "Confirm details" },
    { label: "Result", description: "Bridge status" },
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-border -z-10">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((stepInfo, idx) => {
          const n = idx + 1
          const active = n === step
          const done = n < step

          return (
            <div key={stepInfo.label} className="flex flex-col items-center relative">
              {/* Step circle */}
              <div
                className={`size-8 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  done
                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : active
                      ? "border-primary bg-background text-primary shadow-lg shadow-primary/10"
                      : "border-border bg-card text-muted-foreground"
                }`}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-sm font-semibold">{n}</span>
                )}
              </div>

              {/* Step label and description */}
              <div className="mt-3 text-center">
                <p
                  className={`text-sm font-medium transition-colors duration-200 ${
                    active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {stepInfo.label}
                </p>
                <p
                  className={`text-xs mt-1 transition-colors duration-200 ${
                    active ? "text-muted-foreground" : "text-muted-foreground/60"
                  }`}
                >
                  {stepInfo.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
