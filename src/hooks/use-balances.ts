import { useEffect, useState } from 'react';
import { useAccount, useConfig } from 'wagmi';
import { readContract, getBalance } from '@wagmi/core';
import { TOKENS, Token } from '@/constants/tokens';

const erc20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
];

export function useTokenBalances() {
  const { address } = useAccount();
  const config = useConfig();
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;

    const fetchBalances = async () => {
      setLoading(true);
      const results: Record<string, string> = {};

      await Promise.all(
        Object.values(TOKENS).map(async (token) => {
          try {
            if (token.symbol === 'ETH') {
              const eth = await getBalance(config, { address });
              results[token.symbol] = formatBalance(eth.value, token.decimals);
            } else {
              const raw = await readContract(config, {
                address: token.address as `0x${string}`,
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [address],
              });
              results[token.symbol] = formatBalance(raw as bigint, token.decimals);
            }
          } catch (e) {
            console.warn(`Failed to fetch ${token.symbol} balance`, e);
            results[token.symbol] = '0';
          }
        })
      ); 
      console.log("results balance hook:", results)
      setBalances(results);
      setLoading(false);
    };

    fetchBalances();
  }, [address, config]);

  return { balances, loading };
}

function formatBalance(value: bigint, decimals: number): string {
  return (Number(value) / 10 ** decimals).toFixed(4);
}
