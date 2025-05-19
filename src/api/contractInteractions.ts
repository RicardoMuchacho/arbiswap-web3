import { swapAbi } from '../constants/abi.ts'
import { swapContract } from '@/constants/contractAddresses.ts'
import { type Address } from 'viem'
import { wagmiConfig } from '@/config/wagmiConfig.ts'
import { getPublicClient, readContract, writeContract } from '@wagmi/core'
import { arbitrum } from 'wagmi/chains'

export async function getAmountOut(amountIn: bigint, path: string[]): Promise<bigint> {
    const client = getPublicClient(wagmiConfig)

    const result = await client.readContract({
      abi: swapAbi,
      address: swapContract,
      functionName: 'getAmountOutHelper',
      args: [amountIn, path],
    });
    
    return BigInt(result.toString());
}

export async function swapETHForTokens(
    value: bigint,
    amountOutMin: bigint,
    path: string[],
    account: Address
): Promise<`0x${string}` | undefined> {
    try {
        const result = await writeContract(wagmiConfig, {
            abi: swapAbi,
            address: swapContract,
            functionName: 'swapETHForTokens',
            args: [amountOutMin, path, BigInt(Math.floor(Date.now() / 1000) + 60)],
            account,
            value,
            chain: arbitrum
        });

        return result;
    } catch (error) {
        console.error('Error in swapETHForTokens:', error)
        throw error
    }
}

export async function swapTokensForETH(
    amountIn: bigint,
    amountOutMin: bigint,
    path: string[],
    account: Address
): Promise<`0x${string}` | undefined> {
    try {
        const result = await writeContract(wagmiConfig, {
            abi: swapAbi,
            address: swapContract,
            functionName: 'swapTokensForETH',
            args: [amountIn, amountOutMin, path, BigInt(Math.floor(Date.now() / 1000) + 600)],
            account,
            chain: arbitrum
        });

        return result;
    } catch (error) {
        console.error('Error in swapTokensForETH:', error)
        throw error
    }
}

export async function swapTokens(
    amountIn: bigint,
    amountOutMin: bigint,
    path: string[],
    account: Address
): Promise<`0x${string}` | undefined> {
    try {
        const result = await writeContract(wagmiConfig, {
            abi: swapAbi,
            address: swapContract,
            functionName: 'swapTokens',
            args: [amountIn, amountOutMin, path, BigInt(Math.floor(Date.now() / 1000) + 60)],
            account,
            chain: arbitrum
        });

        return result;
    } catch (error) {
        console.error('Error in swapTokens:', error)
        throw error
    }
}