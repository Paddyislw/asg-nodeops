export function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 rounded-xl2 border border-white/10 px-4 py-3 hover:bg-white/5"
    >
      Back
    </button>
  );
}
