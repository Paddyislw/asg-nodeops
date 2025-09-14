
export function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex-1 rounded-lg border border-border px-6 py-3.5 text-sm font-medium transition-all duration-200 hover:bg-accent/10 hover:border-accent/30 active:scale-[0.98]"
    >
      <span className="flex items-center justify-center gap-2">
        <svg
          className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </span>
    </button>
  )
}
