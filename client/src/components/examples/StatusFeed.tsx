import StatusFeed from "../StatusFeed";

export default function StatusFeedExample() {
  const mockOrders = [
    {
      orderId: "ord_abc123def456",
      status: "confirmed" as const,
      timestamp: new Date(Date.now() - 120000),
      dexSelected: "Raydium" as const,
      executedPrice: 0.052341,
      txHash: "5k7Vm8...9xKp2",
    },
    {
      orderId: "ord_xyz789ghi012",
      status: "routing" as const,
      timestamp: new Date(Date.now() - 30000),
      dexSelected: "Meteora" as const,
    },
    {
      orderId: "ord_mno345pqr678",
      status: "pending" as const,
      timestamp: new Date(Date.now() - 5000),
    },
  ];

  return (
    <div className="max-w-2xl">
      <StatusFeed orders={mockOrders} />
    </div>
  );
}
