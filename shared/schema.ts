import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tokenIn: text("token_in").notNull(),
  tokenOut: text("token_out").notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  slippage: decimal("slippage", { precision: 5, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  dexSelected: text("dex_selected"),
  executedPrice: decimal("executed_price", { precision: 20, scale: 8 }),
  txHash: text("tx_hash"),
  error: text("error"),
  attemptCount: integer("attempt_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  dexSelected: true,
  executedPrice: true,
  txHash: true,
  error: true,
  attemptCount: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
