import WebSocketIndicator from "../WebSocketIndicator";

export default function WebSocketIndicatorExample() {
  return (
    <div className="flex gap-4">
      <WebSocketIndicator isConnected={true} />
      <WebSocketIndicator isConnected={false} />
    </div>
  );
}
