
import React from 'react';
import { Web3Modal } from '@web3modal/react';
import { WagmiConfig } from 'wagmi';
import { wagmiConfig, web3ModalConfig } from '@/config/web3Config';
import Navbar from '@/components/Navbar';
import SwapForm from '@/components/SwapForm';
import PoolsInfo from '@/components/PoolsInfo';
import TransactionHistory from '@/components/TransactionHistory';

const Index = () => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <div className="min-h-screen bg-gradient-to-br from-dex-background to-dex-secondary/30">
        <div className="container max-w-7xl mx-auto px-4">
          <Navbar />
          
          <div className="py-10 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-dex-primary to-dex-accent mb-2">
              SepoliSwap
            </h1>
            <p className="text-dex-foreground/70 mb-10 text-center max-w-md">
              A decentralized exchange for swapping tokens on the Ethereum Sepolia testnet
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full mb-10">
              <div className="lg:col-span-2">
                <SwapForm />
              </div>
              
              <div className="lg:col-span-3 space-y-6">
                <PoolsInfo />
                <TransactionHistory />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Web3Modal
        projectId={web3ModalConfig.projectId}
        ethereumClient={web3ModalConfig.ethereumClient}
        themeMode={web3ModalConfig.themeMode}
      />
    </WagmiConfig>
  );
};

export default Index;
