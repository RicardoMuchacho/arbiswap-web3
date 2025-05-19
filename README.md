# ArbiSwap

![ArbiSwap Interface](public/arbiswap.png)

## Description

ArbiSwap is a decentralized exchange (DEX) application built on the Arbitrum network. It provides a seamless interface for users to swap tokens using the Uniswap V2 protocol. The application is designed to offer efficient and cost-effective token swaps while maintaining the security and reliability of the Arbitrum network.

## Technologies

- **Frontend**:
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn UI

- **Smart Contracts**:
  - Solidity ^0.8.24
  - OpenZeppelin Contracts
  - Forge (Foundry)

- **Network**:
  - Arbitrum
  - Uniswap V2 Protocol
  - Alchemy (api)

## Contracts

The main contract `SwapApp` provides the following functionality:

| Function | Description |
|----------|-------------|
| `swapTokens` | Swaps exact tokens for tokens using the Uniswap V2 router |
| `swapETHForTokens` | Swaps exact ETH for tokens using the Uniswap V2 router |
| `swapTokensForETH` | Swaps exact tokens for ETH using the Uniswap V2 router |


### Contract Address
- **SwapApp**: `0xe2fb9DeD633C5c5e4756FaF0Cb1964CeD8647C39`
- **Router**: `0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24`
- **Factory**: `0xF62c03E08ada871A0bEb309762E260a7a6a880E6`