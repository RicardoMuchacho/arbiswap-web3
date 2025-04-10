
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ExternalLink } from 'lucide-react';

// Mock data for pools
const pools = [
  {
    id: '1',
    token0: { symbol: 'ETH', logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    token1: { symbol: 'USDC', logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png' },
    tvl: '$120,450',
    volume24h: '$24,589',
    apr: '4.2%',
  },
  {
    id: '2',
    token0: { symbol: 'ETH', logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    token1: { symbol: 'DAI', logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png' },
    tvl: '$98,230',
    volume24h: '$18,742',
    apr: '3.8%',
  },
  {
    id: '3',
    token0: { symbol: 'WETH', logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png' },
    token1: { symbol: 'ETH', logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    tvl: '$85,645',
    volume24h: '$12,356',
    apr: '2.9%',
  },
];

const PoolsInfo = () => {
  return (
    <Card className="w-full glass-card rounded-xl overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Liquidity Pools</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-5 text-sm text-dex-foreground/70 pb-1">
            <div className="col-span-1">Pool</div>
            <div className="col-span-1 text-right">TVL</div>
            <div className="col-span-1 text-right">24h Volume</div>
            <div className="col-span-1 text-right">APR</div>
            <div className="col-span-1 text-right"></div>
          </div>
          
          <Separator className="bg-dex-border/50" />
          
          {pools.map((pool) => (
            <div key={pool.id}>
              <div className="grid grid-cols-5 items-center py-2">
                <div className="col-span-1 flex items-center gap-2">
                  <div className="relative flex">
                    <img 
                      src={pool.token0.logoURI} 
                      alt={pool.token0.symbol}
                      className="w-6 h-6 rounded-full z-10" 
                    />
                    <img 
                      src={pool.token1.logoURI} 
                      alt={pool.token1.symbol}
                      className="w-6 h-6 rounded-full -ml-2" 
                    />
                  </div>
                  <span>{pool.token0.symbol}/{pool.token1.symbol}</span>
                </div>
                <div className="col-span-1 text-right">{pool.tvl}</div>
                <div className="col-span-1 text-right">{pool.volume24h}</div>
                <div className="col-span-1 text-right text-dex-success">{pool.apr}</div>
                <div className="col-span-1 text-right">
                  <a 
                    href="#" 
                    className="text-dex-primary hover:text-dex-accent inline-flex items-center gap-1"
                  >
                    Details <ExternalLink size={14} />
                  </a>
                </div>
              </div>
              <Separator className="bg-dex-border/50" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PoolsInfo;
