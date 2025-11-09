import OrderHistoryTable from "../OrderHistoryTable";

export default function OrderHistoryTableExample() {
  const mockOrders = [
    {
      id: "ord_abc123def456",
      timestamp: new Date(Date.now() - 3600000),
      tokenPair: "SOL/USDC",
      amount: 1.5,
      status: "confirmed" as const,
      dex: "Raydium" as const,
      price: 0.052341,
      txHash: "5k7Vm8...9xKp2",
    },
    {
      id: "ord_xyz789ghi012",
      timestamp: new Date(Date.now() - 7200000),
      tokenPair: "SOL/USDT",
      amount: 2.0,
      status: "confirmed" as const,
      dex: "Meteora" as const,
      price: 0.051289,
      txHash: "3m9Pq4...7wLn5",
    },
    {
      id: "ord_mno345pqr678",
      timestamp: new Date(Date.now() - 10800000),
      tokenPair: "USDC/USDT",
      amount: 100,
      status: "failed" as const,
      dex: "Raydium" as const,
      price: 0.999512,
    },
  ];

  return <OrderHistoryTable orders={mockOrders} />;
}
