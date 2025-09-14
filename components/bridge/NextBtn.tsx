"use client"

export function NextBtn({
  enabled,
  onClick,
}: {
  enabled: boolean
  onClick: () => void
}) {
  return (
    <button
      disabled={!enabled}
      onClick={onClick}
      className={`group w-full rounded-lg px-6 py-3.5 font-semibold text-sm transition-all duration-200 ${
        enabled
          ? "bg-primary text-gray-700 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
          : "bg-muted/20 text-muted-foreground cursor-not-allowed"
      }`}
    >
      <span className="flex items-center justify-center gap-2">
        Continue
        {enabled && (
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </span>
    </button>
  )
}
