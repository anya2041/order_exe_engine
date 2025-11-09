import { Clock, ArrowLeftRight, Cog, Send, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type OrderStatus = "pending" | "routing" | "building" | "submitted" | "confirmed" | "failed";

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; icon: React.ComponentType<{ className?: string }>; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  pending: { label: "Pending", icon: Clock, variant: "secondary" },
  routing: { label: "Routing", icon: ArrowLeftRight, variant: "default" },
  building: { label: "Building", icon: Cog, variant: "default" },
  submitted: { label: "Submitted", icon: Send, variant: "default" },
  confirmed: { label: "Confirmed", icon: CheckCircle2, variant: "outline" },
  failed: { label: "Failed", icon: XCircle, variant: "destructive" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1.5" data-testid={`badge-status-${status}`}>
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </Badge>
  );
}
