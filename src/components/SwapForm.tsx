import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAccount, useBalance, useReadContract, useWriteContract, useTransaction } from 'wagmi';
import { ArrowDown, Settings, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import TokenSelect from './TokenSelect';
import { TOKENS, TOKEN_LIST, Token } from '@/constants/tokens';
import { useToast } from '@/components/ui/use-toast';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useConfig } from 'wagmi';
import { useTokenBalances } from '@/hooks/use-balances';
import { getAmountOut } from '@/api/contractInteractions';
import { wagmiConfig } from '@/config/wagmiConfig';
import { swapContract } from '@/constants/contractAddresses';
import { erc20Abi, parseUnits, formatUnits } from 'viem';

const SwapForm = () => {
    const { address, isConnected, chain } = useAccount();
    const { balances, loading } = useTokenBalances();
    const { toast } = useToast();
    const { writeContractAsync } = useWriteContract();
    const { data: transaction } = useTransaction();

    const [tokenFrom, setTokenFrom] = useState<Token>(TOKENS.ETH);
    const [tokenTo, setTokenTo] = useState<Token>(TOKENS.USDT);
    const [amountFrom, setAmountFrom] = useState('');
    const [amountTo, setAmountTo] = useState('');
    const [slippage, setSlippage] = useState(0.5); // 0.5% default slippage
    const [priceImpact, setPriceImpact] = useState<number | null>(null);
    const [exchangeRate, setExchangeRate] = useState<number | null>(null);
    const [isApproved, setIsApproved] = useState(false);

    // Add a debounce timer ref
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Memoize the contract config to prevent unnecessary re-renders
    const contractConfig = useMemo(() => {
        if (!address || !tokenFrom.address || tokenFrom.address === TOKENS.ETH.address) {
            return null;
        }
        return {
            address: tokenFrom.address as `0x${string}`,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [address, swapContract],
        } as const;
    }, [address, tokenFrom.address]);

    // Only run the contract read when the config changes
    const { data: allowance } = useReadContract({
        ...contractConfig,
        query: {
            enabled: !!contractConfig,
        }
    });

    const getSwapQuote = async (fromToken: Token, toToken: Token, amount: string) => {
        if (!amount || parseFloat(amount) === 0) {
            return '0'
        }
        let expectedOutput: bigint = 0n;
        let readableAmount = '0';
        const bigIntAmount = parseUnits(amountFrom, TOKENS[tokenFrom.symbol].decimals)

        if (tokenFrom.symbol == "ETH") {
            expectedOutput = await getAmountOut(bigIntAmount, [TOKENS.WETH.address, tokenTo.address]);
            readableAmount = formatUnits(expectedOutput, TOKENS[tokenTo.symbol].decimals);
        } else {
            expectedOutput = await getAmountOut(bigIntAmount, [tokenFrom.address, tokenTo.address]);
            readableAmount = formatUnits(expectedOutput, TOKENS[tokenTo.symbol].decimals);
        }

        return readableAmount;
    };

    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (amountFrom) {
            // Create a new timer to update the quote after 500ms
            debounceTimerRef.current = setTimeout(async () => {
                const updateQuote = async () => {
                    const toAmount = await getSwapQuote(tokenFrom, tokenTo, amountFrom);
                    setAmountTo(toAmount);
                    // setPriceImpact(priceImpact);
                    // setExchangeRate(rate);
                };

                updateQuote();
            }, 500);
        } else {
            setAmountTo('');
            setPriceImpact(null);
            setExchangeRate(null);
        }

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [amountFrom, tokenFrom, tokenTo]);

    // Update approval status when allowance changes
    useEffect(() => {
        console.log('allowance', allowance)
        if (tokenFrom.address === TOKENS.ETH.address) {
            setIsApproved(true);
        } else if (allowance !== undefined) {
            setIsApproved(Number(allowance) > 0);
        }
    }, [allowance, tokenFrom.address]);

    const handleReverseTokens = () => {
        setTokenFrom(tokenTo);
        setTokenTo(tokenFrom);
        setAmountFrom(amountTo);
        setAmountTo(amountFrom);
    };

    const handleSwap = async () => {
        if (tokenFrom.symbol == "ETH") {
            const bigIntAmount = parseUnits('1', 18); // 1 ETH = 10^18 wei
            const test = await getAmountOut(bigIntAmount, [TOKENS.WETH.address, tokenTo.address]);
            console.log('amountOutETH', test);
        } else {
            const bigIntAmount = parseUnits(amountFrom || '0', TOKENS[tokenFrom.symbol].decimals);
            const test = await getAmountOut(bigIntAmount, [tokenFrom.address, tokenTo.address]);
            console.log('amountOut', test);
        }

        setAmountFrom('');
        setAmountTo('');
    };

    const handleApprove = async () => {
        if (!address || !tokenFrom.address || !chain) return;

        try {
            const hash = await writeContractAsync({
                address: tokenFrom.address as `0x${string}`,
                abi: erc20Abi,
                functionName: 'approve',
                args: [swapContract, BigInt(1e250)],
                chain,
                account: address
            });

            if (transaction?.status === 'success') {
                setIsApproved(true);
                toast({
                    title: "Approval Successful",
                    description: `${tokenFrom.symbol} has been approved for swapping`,
                    variant: "default"
                });
            }
        } catch (error) {
            console.error('Approval failed:', error);
            toast({
                title: "Approval Failed",
                description: "Please try again",
                variant: "destructive"
            });
        }
    };

    const getButtonState = () => {
        if (!isConnected) {
            return {
                text: "Connect Wallet",
                disabled: false,
                action: () => { }
            };
        }
        if (!amountFrom || parseFloat(amountFrom) === 0) {
            return {
                text: "Enter an amount",
                disabled: true,
                action: () => { }
            };
        }

        // For ETH we don't need approval
        if (tokenFrom.symbol === "ETH") {
            return {
                text: `Swap ${tokenFrom.symbol} for ${tokenTo.symbol}`,
                disabled: false,
                action: handleSwap
            };
        }

        if (!isApproved) {
            return {
                text: `Approve ${tokenFrom.symbol}`,
                disabled: false,
                action: handleApprove
            };
        }

        return {
            text: `Swap ${tokenFrom.symbol} for ${tokenTo.symbol}`,
            disabled: false,
            action: handleSwap
        };
    };

    const buttonState = getButtonState();

    return <Card className="w-full max-w-md mx-auto glass-card rounded-xl overflow-hidden p-5 bg-slate-950 text-white">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Swap</h2>
            <Button variant="ghost" size="icon" className="text-dex-foreground/70 hover:text-dex-foreground rounded-full">
                <Settings size={18} />
            </Button>
        </div>

        <div className="bg-dex-background/30 backdrop-blur-sm border border-dex-border/50 rounded-xl p-4 mb-2">
            <div className="flex justify-between mb-2">
                <span className="text-sm text-dex-foreground/70">From</span>
                <span className="text-sm text-dex-foreground/70">
                    Balance: {balances[tokenFrom.symbol]} {tokenFrom.symbol}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <Input type="number" placeholder="0.0" value={amountFrom} onChange={e => setAmountFrom(e.target.value)} className="bg-transparent border-none text-xl py-2 px-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                <TokenSelect selectedToken={tokenFrom} onSelectToken={setTokenFrom} excludeToken={tokenTo} />
            </div>
        </div>

        <div className="relative flex justify-center my-2">
            <Button size="icon" variant="ghost" onClick={handleReverseTokens} className="h-8 w-8 rounded-full bg-dex-primary/20 border border-dex-border/50 z-10 hover:bg-dex-primary/30">
                <ArrowDown size={14} />
            </Button>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-dex-border/50 -translate-y-1/2"></div>
        </div>

        <div className="bg-dex-background/30 backdrop-blur-sm border border-dex-border/50 rounded-xl p-4 mb-5">
            <div className="flex justify-between mb-2">
                <span className="text-sm text-dex-foreground/70">To</span>
                <span className="text-sm text-dex-foreground/70">
                    Balance: {balances[tokenTo.symbol]} {tokenTo.symbol}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <Input type="number" placeholder="0.0" value={amountTo} readOnly className="bg-transparent border-none text-xl py-2 px-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                <TokenSelect selectedToken={tokenTo} onSelectToken={setTokenTo} excludeToken={tokenFrom} />
            </div>
        </div>

        {//exchangeRate && 
            // <div className="bg-dex-primary/10 backdrop-blur-md rounded-lg p-3 mb-5 space-y-2 text-sm border border-dex-border/30">
            //     <div className="flex justify-between">
            //         <span className="text-dex-foreground/70">Rate</span>
            //         <span>
            //             1 {tokenFrom.symbol} = { } {tokenTo.symbol}
            //             {/* 1 {tokenFrom.symbol} = {formatAmount(exchangeRate, 0, 6)} {tokenTo.symbol} */}
            //         </span>
            //     </div>

            //     <div className="flex justify-between items-center">
            //         <div className="flex items-center gap-1">
            //             <span className="text-dex-foreground/70">Price Impact</span>
            //             <TooltipProvider>
            //                 <Tooltip>
            //                     <TooltipTrigger asChild>
            //                         <Info size={14} className="text-dex-foreground/50" />
            //                     </TooltipTrigger>
            //                     <TooltipContent>
            //                         <p className="text-xs max-w-48">
            //                             The difference between the market price and estimated price due to trade size.
            //                         </p>
            //                     </TooltipContent>
            //                 </Tooltip>
            //             </TooltipProvider>
            //         </div>

            //         <span className={`
            //     ${priceImpact && priceImpact > 3 ? 'text-dex-warning' : priceImpact && priceImpact > 1 ? 'text-yellow-400' : 'text-dex-success'}
            //     `}>
            //             {priceImpact ? `${priceImpact.toFixed(2)}%` : '0.00%'}
            //         </span>
            //     </div>

            //     <div className="flex justify-between">
            //         <span className="text-dex-foreground/70">Slippage Tolerance</span>
            //         <span>{slippage}%</span>
            //     </div>
            // </div>
        }
        <ConnectButton.Custom>
            {({ openConnectModal }) => (
                <Button disabled={buttonState.disabled} onClick={isConnected ? buttonState.action : openConnectModal} className="w-full py-6 bg-gradient-to-r from-dex-primary to-dex-primary/80 hover:bg-dex-primary/90 text-white font-medium">
                    {buttonState.text}
                </Button>
            )}
        </ConnectButton.Custom>
    </Card>;
};
export default SwapForm;