import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowRight } from "lucide-react";

interface OrderSubmissionFormProps {
  onSubmit?: (order: {
    tokenIn: string;
    tokenOut: string;
    amount: number;
    slippage: number;
  }) => void;
  isSubmitting?: boolean;
}

export default function OrderSubmissionForm({ onSubmit, isSubmitting }: OrderSubmissionFormProps) {
  const [tokenIn, setTokenIn] = useState("SOL");
  const [tokenOut, setTokenOut] = useState("USDC");
  const [amount, setAmount] = useState("1.0");
  const [slippage, setSlippage] = useState([1]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order submitted:", { tokenIn, tokenOut, amount: parseFloat(amount), slippage: slippage[0] });
    onSubmit?.({
      tokenIn,
      tokenOut,
      amount: parseFloat(amount),
      slippage: slippage[0],
    });
  };

  return (
    <Card data-testid="card-order-form">
      <CardHeader>
        <CardTitle>Execute Market Order</CardTitle>
        <CardDescription>
          Submit an order for immediate execution at the best available price
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="token-in">From</Label>
              <Select value={tokenIn} onValueChange={setTokenIn}>
                <SelectTrigger id="token-in" data-testid="select-token-in">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="token-out">To</Label>
              <Select value={tokenOut} onValueChange={setTokenOut}>
                <SelectTrigger id="token-out" data-testid="select-token-out">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="SOL">SOL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="font-mono"
              data-testid="input-amount"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="slippage">Slippage Tolerance</Label>
              <span className="text-sm font-mono text-muted-foreground" data-testid="text-slippage-value">
                {slippage[0]}%
              </span>
            </div>
            <Slider
              id="slippage"
              min={0.1}
              max={5}
              step={0.1}
              value={slippage}
              onValueChange={setSlippage}
              data-testid="slider-slippage"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
            data-testid="button-submit-order"
          >
            {isSubmitting ? (
              "Processing..."
            ) : (
              <>
                Execute Market Order
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
