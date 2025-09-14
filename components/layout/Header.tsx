import { CustomConnectButton } from "../wallet/CustomConnectButton";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathName = usePathname();
  return (
    <header className="sticky top-0 z-20 bg-black/60 backdrop-blur max-w-6xl mx-auto">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4 md:px-10 md:pt-6">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">NODE Bridge</h1>
          {/* {renderNetworkIndicator()} */}
        </div>
        <div className="flex items-center gap-6">
          {[
            { key: "1", label: "Bridge", value: "/bridge/usdc/eth-base" },
            { key: "2", label: "Dashboard", value: "/dashboard" },
            { key: "3", label: "Instructions", value: "/instructions" },
          ].map((item) => (
            <a
              key={item.key}
              href={item.value}
              className={clsx(
                "text-sm",
                pathName === item.value
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <CustomConnectButton />
        </div>
      </div>
    </header>
  );
};

// const renderNetworkIndicator = () => {
//   const chainId = useChainId();
//   const isChainSupported = isSupportedChain(chainId);
//   return (
//     <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 text-xs">
//       <Globe className="h-3 w-3" />
//       <span>{getSupportedChainName(chainId)}</span>
//       <div
//         className={`w-2 h-2 rounded-full ${
//           isChainSupported ? "bg-green-400" : "bg-red-400"
//         }`}
//       />
//     </div>
//   );
// };

export default Header;
