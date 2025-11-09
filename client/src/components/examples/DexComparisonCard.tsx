import DexComparisonCard from "../DexComparisonCard";

export default function DexComparisonCardExample() {
  return (
    <div className="max-w-md">
      <DexComparisonCard
        raydiumQuote={{ dex: "Raydium", price: 0.052341, fee: 0.3, isSelected: true }}
        meteoraQuote={{ dex: "Meteora", price: 0.051289, fee: 0.2 }}
      />
    </div>
  );
}
