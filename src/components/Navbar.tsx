import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { shortenAddress } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    return (
        <nav className="w-full py-4 flex items-center justify-between border-b border-dex-border/30 backdrop-blur-md bg-dex-background/20">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-dex-primary to-dex-accent animate-pulse-glow"></div>
                <span className="text-xl font-bold text-gradient">
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
                        <span className="px-3 py-1.5 bg-dex-secondary/50 backdrop-blur-md rounded-lg text-sm border border-dex-border/30">
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
                    <ConnectButton.Custom>
                        {({
                            account,
                            chain,
                            openAccountModal,
                            openChainModal,
                            openConnectModal,
                            mounted,
                        }) => {
                            const ready = mounted;
                            const connected = ready && account && chain;

                            return (
                                <div
                                    {...(!ready && {
                                        'aria-hidden': true,
                                        style: {
                                            opacity: 0,
                                            pointerEvents: 'none',
                                            userSelect: 'none',
                                        },
                                    })}
                                >
                                    {(() => {
                                        if (!connected) {
                                            return (
                                                <Button
                                                    onClick={openConnectModal}
                                                    className="bg-dex-primary hover:bg-dex-primary/90 text-white"
                                                >
                                                    Connect Wallet
                                                </Button>
                                            );
                                        }

                                        if (chain.unsupported) {
                                            return (
                                                <Button
                                                    onClick={openChainModal}
                                                    className="bg-dex-error hover:bg-dex-error/90 text-white"
                                                >
                                                    Wrong network
                                                </Button>
                                            );
                                        }

                                        return (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={openChainModal}
                                                    className="bg-dex-secondary/50 hover:bg-dex-secondary/70 text-dex-foreground"
                                                >
                                                    {chain.hasIcon && (
                                                        <div className="w-6 h-6 mr-2">
                                                            {chain.iconUrl && (
                                                                <img
                                                                    alt={chain.name ?? 'Chain icon'}
                                                                    src={chain.iconUrl}
                                                                    className="w-full h-full"
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                    {chain.name}
                                                </Button>
                                                <Button
                                                    onClick={openAccountModal}
                                                    className="bg-dex-secondary/50 hover:bg-dex-secondary/70 text-dex-foreground"
                                                >
                                                    {account.displayName}
                                                    {account.displayBalance
                                                        ? ` (${account.displayBalance})`
                                                        : ''}
                                                </Button>
                                            </div>
                                        );
                                    })()}
                                </div>
                            );
                        }}
                    </ConnectButton.Custom>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
