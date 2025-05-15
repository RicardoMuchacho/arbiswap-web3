import { useReadContract, useWriteContract } from 'wagmi'
import { swapAbi } from '../constants/abi.ts'
import { swapContract } from '@/constants/contractAddresses.ts'
import { type Address } from 'viem'
import { arbitrum } from 'viem/chains'
import { readContract } from 'viem/actions'
import { wagmiConfig } from '@/config/wagmiConfig.ts'
import { getPublicClient } from '@wagmi/core'

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

export const useSwapETHForTokens = (
    amountOutMin: bigint,
    path: string[],
    deadline: bigint,
    value: bigint,
    account: Address
) => {
    const { writeContractAsync } = useWriteContract()

    return async () => {
        try {
            const result = await writeContractAsync({
                abi: swapAbi,
                address: swapContract,
                functionName: 'swapETHForTokens',
                args: [amountOutMin, path, deadline],
                value,
                account,
                chain: arbitrum,
                chainId: arbitrum.id
            })
            return result
        } catch (error) {
            console.error('Error in swapETHForTokens:', error)
            throw error
        }
    }
}

export const useSwapTokensForETH = (
    amountIn: bigint,
    amountOutMin: bigint,
    path: string[],
    deadline: bigint,
    account: Address
) => {
    const { writeContractAsync } = useWriteContract()

    return async () => {
        try {
            const result = await writeContractAsync({
                abi: swapAbi,
                address: swapContract,
                functionName: 'swapTokensForETH',
                args: [amountIn, amountOutMin, path, deadline],
                account,
                chain: arbitrum,
                chainId: arbitrum.id
            })
            return result
        } catch (error) {
            console.error('Error in swapTokensForETH:', error)
            throw error
        }
    }
}

export const useSwapTokens = (
    amountIn: bigint,
    amountOutMin: bigint,
    path: string[],
    deadline: bigint,
    account: Address
) => {
    const { writeContractAsync } = useWriteContract()

    return async () => {
        try {
            const result = await writeContractAsync({
                abi: swapAbi,
                address: swapContract,
                functionName: 'swapTokens',
                args: [amountIn, amountOutMin, path, deadline],
                account,
                chain: arbitrum,
                chainId: arbitrum.id
            })
            return result
        } catch (error) {
            console.error('Error in swapTokens:', error)
            throw error
        }
    }
}