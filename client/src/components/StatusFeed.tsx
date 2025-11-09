import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { Copy, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";

type OrderStatus = "pending" | "routing" | "building" | "submitted" | "confirmed" | "failed";

interface OrderUpdate {
  orderId: string;
  status: OrderStatus;
  timestamp: Date;
  dexSelected?: "Raydium" | "Meteora";
  executedPrice?: number;
  txHash?: string;
  error?: string;
}

interface StatusFeedProps {
  orders: OrderUpdate[];
}

export default function StatusFeed({ orders }: StatusFeedProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    console.log("Copied to clipboard:", text);
  };

  const getProgress = (status: OrderStatus): number => {
    const progressMap = {
      pending: 10,
      routing: 30,
      building: 60,
      submitted: 80,
      confirmed: 100,
      failed: 100,
    };
    return progressMap[status];
  };

  return (
    <Card data-testid="card-status-feed">
      <CardHeader>
        <CardTitle>Real-Time Order Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No orders yet. Submit your first order to get started.
              </div>
            ) : (
              orders.map((order) => {
                const isExpanded = expandedOrder === order.orderId;
                return (
                  <div
                    key={order.orderId}
                    className="border rounded-md p-4 space-y-3 hover-elevate transition-all"
                    data-testid={`card-order-${order.orderId}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">
                            {order.orderId.slice(0, 12)}...
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(order.orderId)}
                            data-testid={`button-copy-${order.orderId}`}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <StatusBadge status={order.status} />
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(order.timestamp, { addSuffix: true })}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setExpandedOrder(isExpanded ? null : order.orderId)}
                        data-testid={`button-expand-${order.orderId}`}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {order.status !== "failed" && (
                      <Progress value={getProgress(order.status)} className="h-1" />
                    )}

                    {isExpanded && (
                      <div className="pt-2 space-y-2 text-sm border-t">
                        {order.dexSelected && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">DEX Selected:</span>
                            <span className="font-semibold">{order.dexSelected}</span>
                          </div>
                        )}
                        {order.executedPrice && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Executed Price:</span>
                            <span className="font-mono">{order.executedPrice.toFixed(6)} SOL</span>
                          </div>
                        )}
                        {order.txHash && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Transaction:</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 gap-1 text-primary hover:text-primary"
                              onClick={() => window.open(`https://explorer.solana.com/tx/${order.txHash}`, '_blank')}
                              data-testid={`link-explorer-${order.orderId}`}
                            >
                              <span className="font-mono text-xs">View on Explorer</span>
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        {order.error && (
                          <div className="text-destructive text-xs">
                            <span className="font-semibold">Error:</span> {order.error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
