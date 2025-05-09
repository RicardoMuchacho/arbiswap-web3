// src/wagmiConfig.ts
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import { arbitrum } from 'wagmi/chains';
import { createConfig, http } from '@wagmi/core'

const { connectors } = getDefaultWallets({
  appName: 'SepoliSwap',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '',
});

export const wagmiConfig = createConfig({
    chains: [arbitrum],
    transports: {
        [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    },
    connectors: connectors,
    ssr: false, // Disable SSR to prevent storage access issues
    batch: {
        multicall: true,
    },
})
