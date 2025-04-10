
import { ethers } from "ethers";

export const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return "";
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

export const formatAmount = (amount: string | number, decimals = 18, displayDecimals = 6): string => {
  if (!amount) return "0";
  
  try {
    const formattedAmount = ethers.utils.formatUnits(amount.toString(), decimals);
    
    // Parse to float and fix to displayDecimals
    const parsed = parseFloat(formattedAmount);
    if (isNaN(parsed)) return "0";
    
    // For very small numbers, show as is
    if (parsed < 0.000001 && parsed > 0) {
      return "< 0.000001";
    }
    
    return parsed.toLocaleString(undefined, {
      maximumFractionDigits: displayDecimals,
      minimumFractionDigits: 0
    });
  } catch (e) {
    console.error("Error formatting amount:", e);
    return "0";
  }
};

export const parseAmount = (amount: string | number, decimals = 18): string => {
  if (!amount) return "0";
  
  try {
    return ethers.utils.parseUnits(amount.toString(), decimals).toString();
  } catch (e) {
    console.error("Error parsing amount:", e);
    return "0";
  }
};
