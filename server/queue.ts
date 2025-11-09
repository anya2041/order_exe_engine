import { Queue, Job } from "bullmq";
import type { InsertOrder } from "@shared/schema";

export interface OrderJobData extends InsertOrder {
  orderId: string;
}

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD,
};

export const orderQueue = new Queue<OrderJobData>("orders", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: {
      age: 3600,
      count: 1000,
    },
    removeOnFail: {
      age: 86400,
      count: 5000,
    },
  },
});

export async function addOrderToQueue(orderId: string, orderData: InsertOrder): Promise<Job<OrderJobData>> {
  const job = await orderQueue.add(
    "execute-order",
    {
      orderId,
      ...orderData,
    },
    {
      jobId: orderId,
    }
  );
  
  console.log(`[Queue] Order ${orderId} added to queue`);
  return job;
}

export async function getQueueMetrics() {
  const [waiting, active, completed, failed] = await Promise.all([
    orderQueue.getWaitingCount(),
    orderQueue.getActiveCount(),
    orderQueue.getCompletedCount(),
    orderQueue.getFailedCount(),
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
    total: waiting + active,
  };
}
