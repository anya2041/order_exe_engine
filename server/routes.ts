import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { addOrderToQueue, getQueueMetrics } from "./queue";
import { orderStatusEmitter, startOrderWorker, type OrderStatusUpdate } from "./order-processor";
import { insertOrderSchema } from "@shared/schema";
import { z } from "zod";

const activeConnections = new Map<string, WebSocket>();

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  await startOrderWorker();
  console.log("[Server] Order worker started");

  orderStatusEmitter.on("orderUpdate", (update: OrderStatusUpdate) => {
    const ws = activeConnections.get(update.orderId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(update));
    }
  });

  httpServer.on("upgrade", (request, socket, head) => {
    const url = new URL(request.url!, `http://${request.headers.host}`);
    
    if (url.pathname.startsWith("/api/orders/execute/")) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on("connection", (ws, request) => {
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const orderId = url.pathname.split("/").pop();
    
    if (orderId) {
      activeConnections.set(orderId, ws);
      console.log(`[WebSocket] Client connected for order ${orderId}`);
      
      ws.send(JSON.stringify({
        type: "connected",
        orderId,
        message: "WebSocket connection established",
      }));

      ws.on("close", () => {
        activeConnections.delete(orderId);
        console.log(`[WebSocket] Client disconnected for order ${orderId}`);
      });

      ws.on("error", (error) => {
        console.error(`[WebSocket] Error for order ${orderId}:`, error);
        activeConnections.delete(orderId);
      });
    }
  });

  app.post("/api/orders/execute", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      
      const order = await storage.createOrder(orderData);
      console.log(`[API] Order created: ${order.id}`);

      await addOrderToQueue(order.id, orderData);

      res.json({
        orderId: order.id,
        status: order.status,
        websocketUrl: `/api/orders/execute/${order.id}`,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Invalid order data",
          errors: error.errors,
        });
      } else {
        console.error("[API] Error creating order:", error);
        res.status(500).json({
          message: "Failed to create order",
        });
      }
    }
  });

  app.get("/api/orders", async (_req, res) => {
    try {
      const orders = await storage.listOrders(100);
      res.json({ orders });
    } catch (error) {
      console.error("[API] Error fetching orders:", error);
      res.status(500).json({
        message: "Failed to fetch orders",
      });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        res.status(404).json({
          message: "Order not found",
        });
        return;
      }
      res.json({ order });
    } catch (error) {
      console.error("[API] Error fetching order:", error);
      res.status(500).json({
        message: "Failed to fetch order",
      });
    }
  });

  app.get("/api/queue/metrics", async (_req, res) => {
    try {
      const metrics = await getQueueMetrics();
      res.json({ metrics });
    } catch (error) {
      console.error("[API] Error fetching queue metrics:", error);
      res.status(500).json({
        message: "Failed to fetch queue metrics",
      });
    }
  });

  return httpServer;
}
