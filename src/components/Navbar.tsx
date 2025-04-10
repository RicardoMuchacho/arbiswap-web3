
import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Web3Button } from '@web3modal/react';
import { shortenAddress } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const Navbar = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <nav className="w-full py-4 px-6 flex items-center justify-between border-b border-dex-border">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-dex-primary animate-pulse-glow"></div>
        <span className="text-xl font-bold bg-gradient-to-r from-dex-primary to-dex-accent bg-clip-text text-transparent">
          SepoliSwap
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <a 
          href="https://sepolia.etherscan.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-dex-foreground/80 hover:text-dex-foreground flex items-center gap-1 text-sm"
        >
          Sepolia Testnet <ExternalLink size={14} />
        </a>
        
        {isConnected ? (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-dex-secondary/50 rounded-lg text-sm">
              {shortenAddress(address || '')}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => disconnect()}
              className="text-dex-foreground/80 hover:text-dex-foreground hover:bg-dex-secondary/30"
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Web3Button />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
