import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "./StatusBadge";
import { Search, ExternalLink } from "lucide-react";
import { useState } from "react";

type OrderStatus = "pending" | "routing" | "building" | "submitted" | "confirmed" | "failed";

interface HistoricalOrder {
  id: string;
  timestamp: Date;
  tokenPair: string;
  amount: number;
  status: OrderStatus;
  dex: "Raydium" | "Meteora";
  price: number;
  txHash?: string;
}

interface OrderHistoryTableProps {
  orders: HistoricalOrder[];
}

export default function OrderHistoryTable({ orders }: OrderHistoryTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.txHash?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card data-testid="card-order-history">
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <div className="flex gap-4 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Order ID or TX Hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40" data-testid="select-status-filter">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Pair</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>DEX</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                  <TableCell className="text-sm text-muted-foreground">
                    {order.timestamp.toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{order.id.slice(0, 12)}...</TableCell>
                  <TableCell className="font-medium">{order.tokenPair}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>{order.dex}</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {order.price.toFixed(6)}
                  </TableCell>
                  <TableCell>
                    {order.txHash && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => window.open(`https://explorer.solana.com/tx/${order.txHash}`, '_blank')}
                        data-testid={`button-explorer-${order.id}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
