
import React from 'react';
import Navbar from '@/components/Navbar';
import SwapForm from '@/components/SwapForm';
import PoolsInfo from '@/components/PoolsInfo';
import TransactionHistory from '@/components/TransactionHistory';
import Footer from '@/components/Footer';
import { useTransactionHistory } from '@/hooks/use-transactions';

const Index = () => {
    const { refetchTransactions } = useTransactionHistory();

    return (
        <div className="min-h-screen bg-gradient-to-br from-dex-background via-dex-secondary/10 to-dex-background/90 backdrop-blur-3xl">
            <div className="absolute inset-0 bg-[url('/background-pattern.svg')] bg-repeat opacity-5 mix-blend-soft-light pointer-events-none" />
            <div className="absolute top-40 left-20 w-72 h-72 bg-dex-primary/20 rounded-full filter blur-3xl opacity-20 animate-pulse-glow" />
            <div className="absolute top-60 right-20 w-96 h-96 bg-dex-accent/20 rounded-full filter blur-3xl opacity-10 animate-pulse-glow" />

            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                <Navbar />

                <div className="py-10 flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold text-gradient mb-2">
                        ArbiSwap
                    </h1>
                    <p className="text-dex-foreground/70 mb-10 text-center max-w-md">
                        A decentralized exchange for swapping tokens on Arbitrum blockchain
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 w-full mb-10">
                        <div className="lg:col-span-3">
                            <SwapForm onSwapSuccess={refetchTransactions} />
                        </div>

                        <div className="lg:col-span-3 space-y-6">
                            {/* <PoolsInfo /> */}
                            <TransactionHistory />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Index;
