
import { configureChains, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { Web3Modal } from "@web3modal/react";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";

// You would normally use your own project ID from WalletConnect Cloud
const projectId = "YOUR_WALLETCONNECT_PROJECT_ID";

// Configure chains for Sepolia testnet
const chains = [sepolia];
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

// Create wagmi config
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

// Create ethereum client
export const ethereumClient = new EthereumClient(wagmiConfig, chains);

// Web3Modal component configuration
export const web3ModalConfig = {
  projectId,
  ethereumClient,
  // Remove themeColor as it's not supported in the current version
  themeMode: "dark" as const,
};

