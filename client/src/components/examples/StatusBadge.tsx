import StatusBadge from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <StatusBadge status="pending" />
      <StatusBadge status="routing" />
      <StatusBadge status="building" />
      <StatusBadge status="submitted" />
      <StatusBadge status="confirmed" />
      <StatusBadge status="failed" />
    </div>
  );
}
