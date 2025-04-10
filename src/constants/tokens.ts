
export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  logoURI: string;
}

// Sepolia testnet tokens
export const TOKENS: Record<string, Token> = {
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // Native ETH placeholder
    logoURI: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  },
  // Example testnet tokens - in a real application, these would be actual tokens on Sepolia
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Example address
    logoURI: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png",
  },
  DAI: {
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    address: "0x68194a729C2450ad26072b3D33ADaCbcef39D574", // Example address
    logoURI: "https://assets.coingecko.com/coins/images/9956/small/4943.png",
  },
  WETH: {
    symbol: "WETH",
    name: "Wrapped Ethereum",
    decimals: 18,
    address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", // Example address
    logoURI: "https://assets.coingecko.com/coins/images/2518/small/weth.png",
  },
};

export const TOKEN_LIST = Object.values(TOKENS);
