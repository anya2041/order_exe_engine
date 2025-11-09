import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "./StatusBadge";

type OrderStatus = "pending" | "routing" | "building" | "submitted" | "confirmed" | "failed";

interface ActiveOrder {
  orderId: string;
  status: OrderStatus;
  tokenPair: string;
}

interface ActiveOrdersSidebarProps {
  orders: ActiveOrder[];
  maxConcurrent?: number;
}

export default function ActiveOrdersSidebar({ orders, maxConcurrent = 10 }: ActiveOrdersSidebarProps) {
  const activeCount = orders.length;
  const usagePercentage = (activeCount / maxConcurrent) * 100;

  return (
    <Card data-testid="card-active-orders">
      <CardHeader className="space-y-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Active Orders</CardTitle>
          <Badge variant={activeCount >= maxConcurrent ? "destructive" : "secondary"} data-testid="badge-order-count">
            {activeCount}/{maxConcurrent}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Queue Capacity</span>
            <span>{usagePercentage.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                usagePercentage >= 90 ? "bg-destructive" : usagePercentage >= 70 ? "bg-chart-3" : "bg-primary"
              }`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          {orders.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No active orders
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.orderId}
                className="p-2 rounded-md border bg-card space-y-2"
                data-testid={`order-item-${order.orderId}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">
                    {order.orderId.slice(0, 8)}...
                  </span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="text-sm font-medium">{order.tokenPair}</div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
