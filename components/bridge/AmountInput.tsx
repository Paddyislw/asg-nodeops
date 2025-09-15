"use client"

import { useAccount, useBalance } from "wagmi";
import { AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { useMemo, useEffect } from "react";

export function AmountInput({
  value,
  onChange,
  balance,
  onMax,
  onValidationChange,
}: {
  value: string
  onChange: (v: string) => void
  balance: string
  onMax: () => void
  onValidationChange?: (isValid: boolean) => void
}) {
  const { address } = useAccount();

  // Get ETH balance for gas fee validation
  const { data: ethBalance } = useBalance({
    address,
    chainId: 11155111, // Sepolia testnet
  });

  // Validation logic
  const validationResult = useMemo(() => {
    const errors: string[] = [];

    // Check if input is empty
    if (!value || value.trim() === "") {
      return { isValid: true, errors: [] }; // Allow empty input
    }

    // Check if input contains only numbers and decimal point
    const numberRegex = /^[0-9]*\.?[0-9]*$/;
    if (!numberRegex.test(value)) {
      errors.push("Please enter numbers only");
    }

    // Check for valid decimal format
    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts.length > 2) {
        errors.push("Invalid decimal format");
      }
      if (parts[1] && parts[1].length > 6) {
        errors.push("Maximum 6 decimal places allowed");
      }
    }

    // Check if amount is greater than 0
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue <= 0) {
      errors.push("Amount must be greater than 0");
    }

    // Check if user has sufficient USDC balance
    const availableBalance = parseFloat(balance) || 0;
    if (!isNaN(numValue) && numValue > availableBalance) {
      errors.push(`Insufficient balance. You have ${balance} USDC`);
    }

    // Check if user has ETH for gas fees
    const ethBalanceValue = ethBalance ? parseFloat(ethBalance.formatted) : 0;
    if (ethBalanceValue < 0.001) {
      errors.push("Insufficient ETH for gas fees. You need at least 0.001 ETH");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [value, balance, ethBalance]);

  // Call validation change callback when validation state changes
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validationResult.isValid && value !== "");
    }
  }, [validationResult.isValid, value, onValidationChange]);

  // Handle input change with validation
  const handleInputChange = (inputValue: string) => {
    // Allow empty input
    if (inputValue === "") {
      onChange("");
      return;
    }

    // Only allow numbers and one decimal point
    const numberRegex = /^[0-9]*\.?[0-9]*$/;
    if (numberRegex.test(inputValue)) {
      // Prevent multiple decimal points
      const decimalCount = (inputValue.match(/\./g) || []).length;
      if (decimalCount <= 1) {
        // Limit decimal places to 6
        if (inputValue.includes('.')) {
          const parts = inputValue.split('.');
          if (parts[1] && parts[1].length > 6) {
            return;
          }
        }
        onChange(inputValue);
      }
    }
  };

  const hasErrors = validationResult.errors.length > 0;
  const inputBorderClass = hasErrors
    ? "border-red-500 focus:border-red-500"
    : value && validationResult.isValid
    ? "border-green-500 focus:border-green-500"
    : "border-border focus:border-primary";

  // Check for zero balances to show faucet CTA
  const hasZeroUSDC = parseFloat(balance) === 0;
  const ethBalanceValue = ethBalance ? parseFloat(ethBalance.formatted) : 0;
  const hasZeroETH = ethBalanceValue === 0;
  const shouldShowFaucetCTA = hasZeroUSDC || hasZeroETH;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">Amount</label>

      <div className="relative">
        <input
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="0.0"
          type="text"
          inputMode="decimal"
          className={`w-full rounded-lg border ${inputBorderClass} bg-input px-4 py-3.5 pr-20 text-sm font-medium text-foreground placeholder:text-muted-foreground transition-all duration-200 hover:border-accent/50`}
        />

        <button
          onClick={onMax}
          disabled={parseFloat(balance) <= 0}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-all duration-200 hover:bg-accent/10 hover:border-accent/50 hover:text-accent active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Max
        </button>

        {/* Status icon */}
        {value && (
          <div className="absolute right-16 top-1/2 -translate-y-1/2">
            {hasErrors ? (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </div>
        )}
      </div>

      {/* Balance info card */}
      <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Available Balance</span>
          <span className="font-medium text-foreground">{balance} USDC</span>
        </div>

        {/* ETH balance info */}
        {ethBalance && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">ETH Balance (Gas)</span>
            <span className={`font-medium ${parseFloat(ethBalance.formatted) < 0.001 ? 'text-red-500' : 'text-foreground'}`}>
              {parseFloat(ethBalance.formatted).toFixed(4)} ETH
            </span>
          </div>
        )}
      </div>

      {/* Error messages */}
      {hasErrors && (
        <div className="space-y-1">
          {validationResult.errors.map((error, index) => (
            <div key={index} className="flex items-start gap-2 text-xs text-red-500">
              <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Success message */}
      {value && validationResult.isValid && (
        <div className="flex items-center gap-2 text-xs text-green-500">
          <CheckCircle className="w-3 h-3" />
          <span>Amount is valid</span>
        </div>
      )}

      {/* Faucet CTA for zero balances */}
      {shouldShowFaucetCTA && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-yellow-400">
                {hasZeroUSDC && hasZeroETH ? 'Get Test Tokens' : hasZeroUSDC ? 'Get USDC' : 'Get ETH'}
              </h4>
              <p className="text-xs text-yellow-200/80 leading-relaxed">
                {hasZeroUSDC && hasZeroETH
                  ? 'You need both USDC to bridge and ETH for gas fees. Get free testnet tokens from the faucets below.'
                  : hasZeroUSDC
                  ? 'You need USDC tokens to bridge. Get free testnet USDC from the faucet.'
                  : 'You need ETH for gas fees. Get free testnet ETH from the faucet.'
                }
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {hasZeroUSDC && (
              <a
                href="https://faucet.circle.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-md border border-yellow-500/30 bg-yellow-500/20 hover:bg-yellow-500/30 px-3 py-2 text-xs font-medium text-yellow-300 transition-all duration-200 flex items-center justify-center gap-1.5 group"
              >
                Get USDC
                <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </a>
            )}
            {hasZeroETH && (
              <a
                href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-md border border-yellow-500/30 bg-yellow-500/20 hover:bg-yellow-500/30 px-3 py-2 text-xs font-medium text-yellow-300 transition-all duration-200 flex items-center justify-center gap-1.5 group"
              >
                Get ETH
                <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
