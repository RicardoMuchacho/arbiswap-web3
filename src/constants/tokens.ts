
export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  logoURI: string;
}

// Arbitrum tokens
export const TOKENS: Record<string, Token> = {
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // Native ETH placeholder
    logoURI: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    logoURI: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png",
  },
  WETH: {
    symbol: "WETH",
    name: "Wrapped Ethereum",
    decimals: 18,
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    logoURI: "https://assets.coingecko.com/coins/images/2518/small/weth.png",
  },
  USDT: {
    symbol: "USDT",
    name: "Tether",
    decimals: 6,
    address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    logoURI: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
  },
  ARB: {
    symbol: "ARB",
    name: "Arbitrum",
    decimals: 18,
    address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
    logoURI: "https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg",
  },
};

export const TOKEN_LIST = Object.values(TOKENS);
