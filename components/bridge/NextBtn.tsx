export function NextBtn({
  enabled,
  onClick,
}: {
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      disabled={!enabled}
      onClick={onClick}
      className={`w-full rounded-xl2 px-4 py-3 font-semibold ${
        enabled
          ? "bg-[#eaf740] text-black hover:opacity-90"
          : "bg-white/10 text-white/40 cursor-not-allowed"
      }`}
    >
      Continue
    </button>
  );
}
