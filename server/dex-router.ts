import crypto from "crypto";

export interface DexQuote {
  dex: "Raydium" | "Meteora";
  price: number;
  fee: number;
  slippage: number;
}

export interface SwapResult {
  txHash: string;
  executedPrice: number;
  dex: "Raydium" | "Meteora";
}

export interface RoutingDecision {
  selectedDex: "Raydium" | "Meteora";
  raydiumQuote: DexQuote;
  meteoraQuote: DexQuote;
  priceDifference: number;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockDexRouter {
  private basePrice: number = 0.05;

  private generateMockTxHash(): string {
    return crypto.randomBytes(32).toString('hex').substring(0, 88);
  }

  private getBasePrice(tokenIn: string, tokenOut: string): number {
    const pair = `${tokenIn}/${tokenOut}`;
    const basePrices: Record<string, number> = {
      "SOL/USDC": 0.052,
      "SOL/USDT": 0.051,
      "USDC/USDT": 0.999,
      "USDC/SOL": 19.23,
      "USDT/SOL": 19.61,
      "USDT/USDC": 1.001,
    };
    return basePrices[pair] || this.basePrice;
  }

  async getRaydiumQuote(
    tokenIn: string,
    tokenOut: string,
    amount: number,
    slippage: number
  ): Promise<DexQuote> {
    await sleep(180 + Math.random() * 40);
    
    const basePrice = this.getBasePrice(tokenIn, tokenOut);
    const variance = 0.98 + Math.random() * 0.04;
    const price = basePrice * variance;

    return {
      dex: "Raydium",
      price,
      fee: 0.003,
      slippage,
    };
  }

  async getMeteorQuote(
    tokenIn: string,
    tokenOut: string,
    amount: number,
    slippage: number
  ): Promise<DexQuote> {
    await sleep(180 + Math.random() * 40);
    
    const basePrice = this.getBasePrice(tokenIn, tokenOut);
    const variance = 0.97 + Math.random() * 0.05;
    const price = basePrice * variance;

    return {
      dex: "Meteora",
      price,
      fee: 0.002,
      slippage,
    };
  }

  async compareAndRoute(
    tokenIn: string,
    tokenOut: string,
    amount: number,
    slippage: number
  ): Promise<RoutingDecision> {
    console.log(`[DEX Router] Fetching quotes for ${amount} ${tokenIn} -> ${tokenOut}`);
    
    const [raydiumQuote, meteoraQuote] = await Promise.all([
      this.getRaydiumQuote(tokenIn, tokenOut, amount, slippage),
      this.getMeteorQuote(tokenIn, tokenOut, amount, slippage),
    ]);

    const raydiumEffectivePrice = raydiumQuote.price * (1 - raydiumQuote.fee);
    const meteoraEffectivePrice = meteoraQuote.price * (1 - meteoraQuote.fee);

    const selectedDex = raydiumEffectivePrice > meteoraEffectivePrice ? "Raydium" : "Meteora";
    const priceDifference = Math.abs(
      ((raydiumEffectivePrice - meteoraEffectivePrice) / meteoraEffectivePrice) * 100
    );

    console.log(`[DEX Router] Raydium: ${raydiumEffectivePrice.toFixed(6)}, Meteora: ${meteoraEffectivePrice.toFixed(6)}`);
    console.log(`[DEX Router] Selected ${selectedDex} (${priceDifference.toFixed(2)}% better)`);

    return {
      selectedDex,
      raydiumQuote,
      meteoraQuote,
      priceDifference,
    };
  }

  async executeSwap(
    dex: "Raydium" | "Meteora",
    tokenIn: string,
    tokenOut: string,
    amount: number,
    expectedPrice: number,
    slippage: number
  ): Promise<SwapResult> {
    const executionDelay = 2000 + Math.random() * 1000;
    console.log(`[DEX Router] Executing swap on ${dex}, estimated ${executionDelay.toFixed(0)}ms`);
    
    await sleep(executionDelay);

    const slippageAdjustment = 1 - (Math.random() * slippage * 0.01);
    const executedPrice = expectedPrice * slippageAdjustment;
    const txHash = this.generateMockTxHash();

    console.log(`[DEX Router] Swap executed successfully on ${dex}`);
    console.log(`[DEX Router] TX Hash: ${txHash}`);
    console.log(`[DEX Router] Executed Price: ${executedPrice.toFixed(6)}`);

    return {
      txHash,
      executedPrice,
      dex,
    };
  }

  async routeAndExecute(
    tokenIn: string,
    tokenOut: string,
    amount: number,
    slippage: number
  ): Promise<SwapResult & { routing: RoutingDecision }> {
    const routing = await this.compareAndRoute(tokenIn, tokenOut, amount, slippage);
    
    const selectedQuote = routing.selectedDex === "Raydium" 
      ? routing.raydiumQuote 
      : routing.meteoraQuote;

    const swapResult = await this.executeSwap(
      routing.selectedDex,
      tokenIn,
      tokenOut,
      amount,
      selectedQuote.price,
      slippage
    );

    return {
      ...swapResult,
      routing,
    };
  }
}

export const dexRouter = new MockDexRouter();
