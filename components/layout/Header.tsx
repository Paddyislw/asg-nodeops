import { CustomConnectButton } from "../wallet/CustomConnectButton";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const pathName = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { key: "1", label: "Bridge", value: "/bridge/usdc/eth-base" },
    { key: "2", label: "Dashboard", value: "/dashboard" },
    { key: "3", label: "Instructions", value: "/instructions" },
    { key: "4", label: "Demo", value: "/demo" },
  ];

  return (
    <header className="sticky top-0 z-20 bg-black/60 backdrop-blur max-w-6xl mx-auto">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4 md:px-10 md:pt-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">NODE Bridge</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navigationItems.map((item) => (
            <a
              key={item.key}
              href={item.value}
              className={clsx(
                "text-sm transition-colors",
                pathName === item.value
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Desktop Connect Button */}
        <div className="hidden md:flex items-center gap-4">
          <CustomConnectButton />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-black/80 backdrop-blur">
          <div className="max-w-5xl mx-auto p-4 space-y-4">
            {/* Mobile Navigation */}
            <nav className="space-y-3">
              {navigationItems.map((item) => (
                <a
                  key={item.key}
                  href={item.value}
                  className={clsx(
                    "block text-sm py-2 transition-colors",
                    pathName === item.value
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Mobile Connect Button */}
            <div className="pt-3 border-t border-border">
              <CustomConnectButton />
            </div>
          </div>
        </div>
      )}
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
