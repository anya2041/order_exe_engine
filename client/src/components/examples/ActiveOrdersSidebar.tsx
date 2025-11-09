import ActiveOrdersSidebar from "../ActiveOrdersSidebar";

export default function ActiveOrdersSidebarExample() {
  const mockOrders = [
    { orderId: "ord_abc123", status: "routing" as const, tokenPair: "SOL/USDC" },
    { orderId: "ord_def456", status: "building" as const, tokenPair: "SOL/USDT" },
    { orderId: "ord_ghi789", status: "submitted" as const, tokenPair: "USDC/USDT" },
  ];

  return (
    <div className="max-w-sm">
      <ActiveOrdersSidebar orders={mockOrders} />
    </div>
  );
}
