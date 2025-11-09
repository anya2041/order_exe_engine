import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

interface WebSocketIndicatorProps {
  isConnected: boolean;
}

export default function WebSocketIndicator({ isConnected }: WebSocketIndicatorProps) {
  return (
    <Badge 
      variant={isConnected ? "outline" : "secondary"} 
      className="gap-1.5"
      data-testid="indicator-websocket"
    >
      {isConnected ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <Wifi className="h-3 w-3" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span>Disconnected</span>
        </>
      )}
    </Badge>
  );
}
