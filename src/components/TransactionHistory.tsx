
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, ArrowRightLeft, Plus } from 'lucide-react';
import { shortenAddress } from '@/utils/formatters';

// Mock data for transaction history
const transactions = [
  {
    id: '1',
    type: 'swap',
    timestamp: '2h ago',
    from: { symbol: 'ETH', amount: '0.5' },
    to: { symbol: 'USDC', amount: '1,700' },
    account: '0x1234567890abcdef1234567890abcdef12345678',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  },
  {
    id: '2',
    type: 'add',
    timestamp: '5h ago',
    from: { symbol: 'ETH', amount: '0.2' },
    to: { symbol: 'DAI', amount: '678' },
    account: '0x1234567890abcdef1234567890abcdef12345678',
    txHash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
  },
  {
    id: '3',
    type: 'swap',
    timestamp: '1d ago',
    from: { symbol: 'USDC', amount: '500' },
    to: { symbol: 'ETH', amount: '0.15' },
    account: '0x1234567890abcdef1234567890abcdef12345678',
    txHash: '0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0',
  },
];

const TransactionHistory = () => {
  return (
    <Card className="w-full glass-card rounded-xl overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.length > 0 ? (
            <>
              <div className="grid grid-cols-12 text-sm text-dex-foreground/70 pb-1">
                <div className="col-span-1">Type</div>
                <div className="col-span-2">Time</div>
                <div className="col-span-5">Details</div>
                <div className="col-span-3">Account</div>
                <div className="col-span-1 text-right"></div>
              </div>
              
              <Separator className="bg-dex-border/50" />
              
              {transactions.map((tx) => (
                <div key={tx.id}>
                  <div className="grid grid-cols-12 items-center py-2">
                    <div className="col-span-1">
                      {tx.type === 'swap' ? (
                        <ArrowRightLeft size={16} className="text-dex-primary" />
                      ) : (
                        <Plus size={16} className="text-dex-success" />
                      )}
                    </div>
                    
                    <div className="col-span-2 text-dex-foreground/70">
                      {tx.timestamp}
                    </div>
                    
                    <div className="col-span-5">
                      {tx.type === 'swap' ? (
                        <span>
                          Swapped {tx.from.amount} {tx.from.symbol} for {tx.to.amount} {tx.to.symbol}
                        </span>
                      ) : (
                        <span>
                          Added {tx.from.amount} {tx.from.symbol} and {tx.to.amount} {tx.to.symbol}
                        </span>
                      )}
                    </div>
                    
                    <div className="col-span-3 text-dex-foreground/70">
                      {shortenAddress(tx.account)}
                    </div>
                    
                    <div className="col-span-1 text-right">
                      <a 
                        href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dex-primary hover:text-dex-accent"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                  <Separator className="bg-dex-border/50" />
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-8 text-dex-foreground/70">
              No transactions yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
