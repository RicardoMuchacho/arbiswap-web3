import React, { useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TOKEN_LIST, Token } from '@/constants/tokens';
interface TokenSelectProps {
  selectedToken: Token | null;
  onSelectToken: (token: Token) => void;
  excludeToken?: Token | null;
}
const TokenSelect: React.FC<TokenSelectProps> = ({
  selectedToken,
  onSelectToken,
  excludeToken
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const filteredTokens = TOKEN_LIST.filter(token => {
    // Exclude the token that's already selected in the other input
    if (excludeToken && token.address === excludeToken.address) {
      return false;
    }

    // Filter by search query
    const query = searchQuery.toLowerCase();
    return token.symbol.toLowerCase().includes(query) || token.name.toLowerCase().includes(query) || token.address.toLowerCase().includes(query);
  });
  const handleSelectToken = (token: Token) => {
    onSelectToken(token);
    setIsOpen(false);
  };
  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button type="button" className="flex items-center gap-2 py-2 px-3 rounded-lg transition-colors text-sm font-medium border border-dex-border/50 bg-slate-300 hover:bg-slate-200 text-slate-500">
          {selectedToken ? <>
              <img src={selectedToken.logoURI} alt={selectedToken.symbol} className="w-5 h-5 rounded-full" />
              {selectedToken.symbol}
            </> : "Select Token"}
          <ChevronDown size={16} />
        </button>
      </DialogTrigger>
      
      <DialogContent className="glass-card sm:max-w-md">
        <div className="space-y-4 p-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Select Token</h2>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-dex-secondary/50 transition-colors">
              <X size={18} />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dex-foreground/50" size={16} />
            <Input placeholder="Search by name or paste address" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-dex-secondary/30 border-dex-border/50" />
          </div>
          
          <div className="h-80 overflow-y-auto pr-2 space-y-1">
            {filteredTokens.length > 0 ? filteredTokens.map(token => <button key={token.address} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-dex-secondary/50 transition-all" onClick={() => handleSelectToken(token)}>
                  <img src={token.logoURI} alt={token.symbol} className="w-8 h-8 rounded-full" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{token.symbol}</span>
                    <span className="text-sm text-dex-foreground/70">{token.name}</span>
                  </div>
                </button>) : <div className="text-center p-4 text-dex-foreground/70">
                No tokens found
              </div>}
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
export default TokenSelect;