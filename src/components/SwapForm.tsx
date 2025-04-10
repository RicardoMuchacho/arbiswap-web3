import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ArrowDown, Settings, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import TokenSelect from './TokenSelect';
import { TOKENS, Token } from '@/constants/tokens';
import { formatAmount } from '@/utils/formatters';
import { useToast } from '@/components/ui/use-toast';
const SwapForm = () => {
  const {
    address,
    isConnected
  } = useAccount();
  const {
    toast
  } = useToast();
  const [tokenFrom, setTokenFrom] = useState<Token>(TOKENS.ETH);
  const [tokenTo, setTokenTo] = useState<Token>(TOKENS.USDC);
  const [amountFrom, setAmountFrom] = useState('');
  const [amountTo, setAmountTo] = useState('');
  const [slippage, setSlippage] = useState(0.5); // 0.5% default slippage
  const [priceImpact, setPriceImpact] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const getSwapQuote = (fromToken: Token, toToken: Token, amount: string) => {
    if (!amount || parseFloat(amount) === 0) {
      return {
        toAmount: '0',
        priceImpact: 0,
        rate: 0
      };
    }
    let rate = 0;
    if (fromToken.symbol === 'ETH' && toToken.symbol === 'USDC') {
      rate = 3400; // 1 ETH = 3400 USDC
    } else if (fromToken.symbol === 'USDC' && toToken.symbol === 'ETH') {
      rate = 1 / 3400; // 1 USDC = 0.000294 ETH
    } else if (fromToken.symbol === 'ETH' && toToken.symbol === 'DAI') {
      rate = 3390; // 1 ETH = 3390 DAI
    } else if (fromToken.symbol === 'DAI' && toToken.symbol === 'ETH') {
      rate = 1 / 3390; // 1 DAI = 0.000295 ETH
    } else if (fromToken.symbol === 'ETH' && toToken.symbol === 'WETH') {
      rate = 0.998; // 1 ETH = 0.998 WETH (small fee)
    } else if (fromToken.symbol === 'WETH' && toToken.symbol === 'ETH') {
      rate = 1.002; // 1 WETH = 1.002 ETH
    } else if (fromToken.symbol === 'USDC' && toToken.symbol === 'DAI') {
      rate = 0.995; // 1 USDC = 0.995 DAI
    } else if (fromToken.symbol === 'DAI' && toToken.symbol === 'USDC') {
      rate = 1.005; // 1 DAI = 1.005 USDC
    }
    const parsedAmount = parseFloat(amount);
    const toAmount = (parsedAmount * rate).toString();
    const mockPriceImpact = parsedAmount > 10 ? Math.min(parsedAmount * 0.005, 5) :
    // 0.5% per unit, max 5%
    0.1; // Minimum price impact

    return {
      toAmount,
      priceImpact: mockPriceImpact,
      rate
    };
  };
  useEffect(() => {
    if (amountFrom) {
      const {
        toAmount,
        priceImpact,
        rate
      } = getSwapQuote(tokenFrom, tokenTo, amountFrom);
      setAmountTo(toAmount);
      setPriceImpact(priceImpact);
      setExchangeRate(rate);
    } else {
      setAmountTo('');
      setPriceImpact(null);
      setExchangeRate(null);
    }
  }, [amountFrom, tokenFrom, tokenTo]);
  const handleReverseTokens = () => {
    setTokenFrom(tokenTo);
    setTokenTo(tokenFrom);
    setAmountFrom(amountTo);
    setAmountTo(amountFrom);
  };
  const handleSwap = () => {
    toast({
      title: "Swap Simulated",
      description: `Swapped ${amountFrom} ${tokenFrom.symbol} for ${amountTo} ${tokenTo.symbol}`,
      variant: "default"
    });
    setAmountFrom('');
    setAmountTo('');
  };
  const getButtonState = () => {
    if (!isConnected) {
      return {
        text: "Connect Wallet",
        disabled: false,
        action: () => {}
      };
    }
    if (!amountFrom || parseFloat(amountFrom) === 0) {
      return {
        text: "Enter an amount",
        disabled: true,
        action: () => {}
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
            Balance: 1.5 {tokenFrom.symbol}
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
            Balance: 1000 {tokenTo.symbol}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Input type="number" placeholder="0.0" value={amountTo} readOnly className="bg-transparent border-none text-xl py-2 px-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
          <TokenSelect selectedToken={tokenTo} onSelectToken={setTokenTo} excludeToken={tokenFrom} />
        </div>
      </div>
      
      {exchangeRate && <div className="bg-dex-primary/10 backdrop-blur-md rounded-lg p-3 mb-5 space-y-2 text-sm border border-dex-border/30">
          <div className="flex justify-between">
            <span className="text-dex-foreground/70">Rate</span>
            <span>
              1 {tokenFrom.symbol} = {formatAmount(exchangeRate, 0, 6)} {tokenTo.symbol}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-dex-foreground/70">Price Impact</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={14} className="text-dex-foreground/50" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-48">
                      The difference between the market price and estimated price due to trade size.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <span className={`
              ${priceImpact && priceImpact > 3 ? 'text-dex-warning' : priceImpact && priceImpact > 1 ? 'text-yellow-400' : 'text-dex-success'}
            `}>
              {priceImpact ? `${priceImpact.toFixed(2)}%` : '0.00%'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-dex-foreground/70">Slippage Tolerance</span>
            <span>{slippage}%</span>
          </div>
        </div>}
      
      <Button disabled={buttonState.disabled} onClick={buttonState.action} className="w-full py-6 bg-gradient-to-r from-dex-primary to-dex-primary/80 hover:bg-dex-primary/90 text-white font-medium">
        {buttonState.text}
      </Button>
    </Card>;
};
export default SwapForm;