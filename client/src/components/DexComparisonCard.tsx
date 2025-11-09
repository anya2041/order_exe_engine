import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";

interface DexQuote {
  dex: "Raydium" | "Meteora";
  price: number;
  fee: number;
  isSelected?: boolean;
}

interface DexComparisonCardProps {
  raydiumQuote: DexQuote;
  meteoraQuote: DexQuote;
  isLoading?: boolean;
}

export default function DexComparisonCard({ raydiumQuote, meteoraQuote, isLoading }: DexComparisonCardProps) {
  const priceDiff = ((raydiumQuote.price - meteoraQuote.price) / meteoraQuote.price) * 100;
  
  return (
    <Card data-testid="card-dex-comparison">
      <CardHeader className="space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">DEX Routing Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className={`p-3 rounded-md border ${raydiumQuote.isSelected ? 'bg-primary/5 border-primary' : 'bg-card'} transition-colors`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Raydium</span>
              {raydiumQuote.isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
            </div>
            <Badge variant="secondary" className="text-xs font-mono">
              {raydiumQuote.fee}% fee
            </Badge>
          </div>
          <div className="font-mono text-lg font-semibold" data-testid="text-raydium-price">
            {isLoading ? "..." : raydiumQuote.price.toFixed(6)} SOL
          </div>
        </div>

        <div className={`p-3 rounded-md border ${meteoraQuote.isSelected ? 'bg-primary/5 border-primary' : 'bg-card'} transition-colors`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Meteora</span>
              {meteoraQuote.isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
            </div>
            <Badge variant="secondary" className="text-xs font-mono">
              {meteoraQuote.fee}% fee
            </Badge>
          </div>
          <div className="font-mono text-lg font-semibold" data-testid="text-meteora-price">
            {isLoading ? "..." : meteoraQuote.price.toFixed(6)} SOL
          </div>
        </div>

        {!isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
            {priceDiff > 0 ? (
              <TrendingUp className="h-4 w-4 text-chart-2" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span className="font-mono">
              {Math.abs(priceDiff).toFixed(2)}% difference
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
