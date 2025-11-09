import { Worker, Job } from "bullmq";
import { EventEmitter } from "events";
import { dexRouter } from "./dex-router";
import { storage } from "./storage";
import type { OrderJobData } from "./queue";
import type { Order } from "@shared/schema";

export type OrderStatus = "pending" | "routing" | "building" | "submitted" | "confirmed" | "failed";

export interface OrderStatusUpdate {
  orderId: string;
  status: OrderStatus;
  dexSelected?: "Raydium" | "Meteora";
  executedPrice?: string;
  txHash?: string;
  error?: string;
  order?: Order;
}

export const orderStatusEmitter = new EventEmitter();

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD,
};

async function emitStatusUpdate(update: OrderStatusUpdate) {
  orderStatusEmitter.emit("orderUpdate", update);
  console.log(`[Order Processor] Status update: ${update.orderId} -> ${update.status}`);
}

async function processOrder(job: Job<OrderJobData>): Promise<void> {
  const { orderId, tokenIn, tokenOut, amount, slippage } = job.data;
  const attemptNumber = job.attemptsMade + 1;
  
  console.log(`[Order Processor] Processing order ${orderId} (attempt ${attemptNumber}/3)`);

  try {
    await storage.updateOrder(orderId, {
      status: "pending",
      attemptCount: attemptNumber,
    });
    await emitStatusUpdate({ orderId, status: "pending" });

    await new Promise(resolve => setTimeout(resolve, 500));

    await storage.updateOrder(orderId, { status: "routing" });
    await emitStatusUpdate({ orderId, status: "routing" });

    const routing = await dexRouter.compareAndRoute(
      tokenIn,
      tokenOut,
      parseFloat(amount),
      parseFloat(slippage)
    );

    await storage.updateOrder(orderId, { dexSelected: routing.selectedDex });
    await emitStatusUpdate({
      orderId,
      status: "routing",
      dexSelected: routing.selectedDex,
    });

    await new Promise(resolve => setTimeout(resolve, 300));

    await storage.updateOrder(orderId, { status: "building" });
    await emitStatusUpdate({
      orderId,
      status: "building",
      dexSelected: routing.selectedDex,
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    await storage.updateOrder(orderId, { status: "submitted" });
    await emitStatusUpdate({
      orderId,
      status: "submitted",
      dexSelected: routing.selectedDex,
    });

    const selectedQuote = routing.selectedDex === "Raydium"
      ? routing.raydiumQuote
      : routing.meteoraQuote;

    const swapResult = await dexRouter.executeSwap(
      routing.selectedDex,
      tokenIn,
      tokenOut,
      parseFloat(amount),
      selectedQuote.price,
      parseFloat(slippage)
    );

    const updatedOrder = await storage.updateOrder(orderId, {
      status: "confirmed",
      executedPrice: swapResult.executedPrice.toString(),
      txHash: swapResult.txHash,
    });

    await emitStatusUpdate({
      orderId,
      status: "confirmed",
      dexSelected: routing.selectedDex,
      executedPrice: swapResult.executedPrice.toString(),
      txHash: swapResult.txHash,
      order: updatedOrder,
    });

    console.log(`[Order Processor] Order ${orderId} confirmed successfully`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Order Processor] Error processing order ${orderId}:`, errorMessage);

    if (attemptNumber >= 3) {
      await storage.updateOrder(orderId, {
        status: "failed",
        error: errorMessage,
        attemptCount: attemptNumber,
      });

      await emitStatusUpdate({
        orderId,
        status: "failed",
        error: errorMessage,
      });

      console.log(`[Order Processor] Order ${orderId} failed after ${attemptNumber} attempts`);
    } else {
      console.log(`[Order Processor] Order ${orderId} will retry (attempt ${attemptNumber + 1}/3)`);
    }

    throw error;
  }
}

export const orderWorker = new Worker<OrderJobData>(
  "orders",
  processOrder,
  {
    connection,
    concurrency: 10,
    autorun: false,
  }
);

orderWorker.on("completed", (job) => {
  console.log(`[Worker] Job ${job.id} completed successfully`);
});

orderWorker.on("failed", (job, err) => {
  if (job) {
    console.error(`[Worker] Job ${job.id} failed:`, err.message);
  }
});

orderWorker.on("error", (err) => {
  console.error("[Worker] Worker error:", err);
});

export async function startOrderWorker() {
  await orderWorker.run();
  console.log("[Worker] Order worker started with concurrency: 10");
}

export async function stopOrderWorker() {
  await orderWorker.close();
  console.log("[Worker] Order worker stopped");
}
