// useTransactionHistory.ts
import { useEffect, useState } from "react";
import { Alchemy, Network, AssetTransfersWithMetadataResult } from "alchemy-sdk";
import { useAccount } from "wagmi";

export interface FormattedTransaction {
    hash: string;
    from: string;
    to: string;
    asset: string;
    category: string;
    value: number | string;
    contractAddress: string;
    timestamp: string;
}

const formatTransaction = (tx: AssetTransfersWithMetadataResult): FormattedTransaction => {
    const date = new Date(tx.metadata.blockTimestamp);
    return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        asset: tx.asset,
        category: tx.category,
        value: tx.value ?? "N/A",
        contractAddress: tx.rawContract.address ?? "N/A",
        timestamp: date.toLocaleString(),
    };
};

export const useTransactionHistory = () => {
    const { address } = useAccount();
    const [transactions, setTransactions] = useState<FormattedTransaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!address) return setTransactions([]);
        fetchTransactions();
    }, [address]);

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);

        try {
            const config = {
                apiKey: import.meta.env.VITE_ALCHEMY_KEY || '',
                network: Network.ARB_MAINNET,
            };

            const alchemy = new Alchemy(config);

            const response = await alchemy.core.getAssetTransfers({
                fromBlock: "0x0",
                toAddress: address,
                category: ["external", "erc20"],
                withMetadata: true,
                maxCount: 4,
                order: "desc",
            });
            const formatted = response.transfers.map(formatTransaction);
            setTransactions(formatted);
        } catch (err) {
            console.error("Failed to fetch transactions:", err);
            setError("Failed to load transactions");
        } finally {
            setLoading(false);
        }
    };

    return { transactions, loading, error, refetchTransactions: fetchTransactions };
};
