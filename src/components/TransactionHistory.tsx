import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    ExternalLink,
    ArrowRightLeft,
    Plus,
} from "lucide-react";
import { FormattedTransaction } from "@/hooks/use-transactions";

interface props {
    loading: boolean;
    transactions: FormattedTransaction[];
}

const TransactionHistory = ({ loading, transactions }: props) => {
    return (
        <Card className="w-full glass-card rounded-xl overflow-hidden bg-slate-950 text-white">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-8 text-white/70">Loading...</div>
                    ) : transactions.length > 0 ? (
                        <>
                            <div className="grid grid-cols-12 text-sm text-white/70 pb-1">
                                <div className="col-span-1">Type</div>
                                <div className="col-span-2">Time</div>
                                <div className="col-span-8">Details</div>
                                <div className="col-span-1 text-right"></div>
                            </div>

                            <Separator className="bg-dex-border/50" />

                            {transactions.map((tx) => (
                                <div key={tx.hash}>
                                    <div className="grid grid-cols-12 items-center py-2">
                                        <div className="col-span-1">
                                            {tx.category === "erc20" ? (
                                                <ArrowRightLeft size={16} className="text-dex-primary" />
                                            ) : (
                                                <Plus size={16} className="text-dex-success" />
                                            )}
                                        </div>

                                        <div className="col-span-2 text-white/70">{tx.timestamp}</div>

                                        <div className="col-span-8">
                                            <span>
                                                {tx.value !== null ? `${tx.value} ${tx.asset}` : tx.asset}{" "}
                                                from {tx.from}
                                            </span>
                                        </div>

                                        <div className="col-span-1 text-right">
                                            <a
                                                href={`https://arbiscan.io/tx/${tx.hash}`}
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
                        <div className="text-center py-8 text-white/70">No transactions yet</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default TransactionHistory;
