import { useState } from "react";
import OrderSubmissionForm from "@/components/OrderSubmissionForm";
import StatusFeed from "@/components/StatusFeed";
import DexComparisonCard from "@/components/DexComparisonCard";
import ActiveOrdersSidebar from "@/components/ActiveOrdersSidebar";
import OrderHistoryTable from "@/components/OrderHistoryTable";
import WebSocketIndicator from "@/components/WebSocketIndicator";
import { Activity } from "lucide-react";

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

export default function Dashboard() {
  const [isConnected] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [orders, setOrders] = useState<OrderUpdate[]>([
    {
      orderId: "ord_abc123def456",
      status: "confirmed",
      timestamp: new Date(Date.now() - 120000),
      dexSelected: "Raydium",
      executedPrice: 0.052341,
      txHash: "5k7Vm8...9xKp2",
    },
    {
      orderId: "ord_xyz789ghi012",
      status: "routing",
      timestamp: new Date(Date.now() - 30000),
      dexSelected: "Meteora",
    },
  ]);

  const [activeOrders] = useState([
    { orderId: "ord_xyz789ghi012", status: "routing" as const, tokenPair: "SOL/USDC" },
  ]);

  const [historicalOrders] = useState([
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
      id: "ord_mno345pqr678",
      timestamp: new Date(Date.now() - 7200000),
      tokenPair: "SOL/USDT",
      amount: 2.0,
      status: "confirmed" as const,
      dex: "Meteora" as const,
      price: 0.051289,
      txHash: "3m9Pq4...7wLn5",
    },
  ]);

  const handleOrderSubmit = (order: { tokenIn: string; tokenOut: string; amount: number; slippage: number }) => {
    console.log("Submitting order:", order);
    setIsSubmitting(true);
    
    const newOrderId = `ord_${Math.random().toString(36).substring(2, 15)}`;
    const newOrder: OrderUpdate = {
      orderId: newOrderId,
      status: "pending",
      timestamp: new Date(),
    };
    
    setOrders(prev => [newOrder, ...prev]);
    
    setTimeout(() => {
      setOrders(prev => 
        prev.map(o => o.orderId === newOrderId ? { ...o, status: "routing" as const } : o)
      );
    }, 1000);
    
    setTimeout(() => {
      setOrders(prev => 
        prev.map(o => o.orderId === newOrderId ? { 
          ...o, 
          status: "building" as const,
          dexSelected: Math.random() > 0.5 ? "Raydium" as const : "Meteora" as const
        } : o)
      );
    }, 2000);
    
    setTimeout(() => {
      setOrders(prev => 
        prev.map(o => o.orderId === newOrderId ? { ...o, status: "submitted" as const } : o)
      );
    }, 3500);
    
    setTimeout(() => {
      setOrders(prev => 
        prev.map(o => o.orderId === newOrderId ? { 
          ...o, 
          status: "confirmed" as const,
          executedPrice: 0.05 + Math.random() * 0.01,
          txHash: `${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`
        } : o)
      );
      setIsSubmitting(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Solana DEX Engine</h1>
                <p className="text-xs text-muted-foreground">Market Order Execution</p>
              </div>
            </div>
            <WebSocketIndicator isConnected={isConnected} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <OrderSubmissionForm onSubmit={handleOrderSubmit} isSubmitting={isSubmitting} />
            <StatusFeed orders={orders} />
          </div>

          <div className="space-y-6">
            <DexComparisonCard
              raydiumQuote={{ dex: "Raydium", price: 0.052341, fee: 0.3, isSelected: true }}
              meteoraQuote={{ dex: "Meteora", price: 0.051289, fee: 0.2 }}
            />
            <ActiveOrdersSidebar orders={activeOrders} />
          </div>
        </div>

        <div className="mt-8">
          <OrderHistoryTable orders={historicalOrders} />
        </div>
      </main>
    </div>
  );
}
