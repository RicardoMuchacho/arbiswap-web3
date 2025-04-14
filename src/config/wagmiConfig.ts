// src/wagmiConfig.ts
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets
} from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { createConfig, http } from '@wagmi/core'

// const { chains, publicClient } = configureChains(
//   [sepolia],
//   [publicProvider()] // You can add Alchemy or Infura here if you want
// );

const { connectors } = getDefaultWallets({
  appName: 'SepoliSwap',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '',
});

export const wagmiConfig = createConfig({
    chains: [sepolia],
    transports: {
        [sepolia.id]: http('https://sepolia.example.com'),
      },
    connectors: connectors,
})
