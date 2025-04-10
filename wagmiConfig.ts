// // wagmiConfig.ts
// import '@rainbow-me/rainbowkit/styles.css';
// import { getDefaultWallets } from '@rainbow-me/rainbowkit';
// import {
//   configureChains,
//   createConfig,
//   WagmiConfig
// } from 'wagmi';
import { sepolia } from 'wagmi/chains';
// import { publicProvider } from 'wagmi';

// const { chains, publicClient } = configureChains(
//   [sepolia],
//   [publicProvider()]
// );

// const { connectors } = getDefaultWallets({
//   appName: 'RickCrypto DEX',
//   projectId: process.env.VITE_WALLET_CONNECT_PROJECT_ID, // optional, for WalletConnect cloud features
// //   sepolia
// });

// export const wagmiConfig = createConfig({
// //   autoConnect: true,
//   connectors,
//   publicClient
// });

// export { chains };

import { getDefaultConfig } from '@rainbow-me/rainbowkit';

export const wagmiConfig = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [sepolia],
});
