hi

Order Execution Engine

This is a backend service that executes market orders with DEX routing and real-time WebSocket status updates. It follows the requirements in Backend Task 2 using mock implementation (Option B).

Why Market Orders
Market orders were chosen because they provide immediate, predictable execution and serve as the simplest reliable foundation for an execution engine. The same architecture can be extended to support limit orders by adding a price-monitoring loop that triggers a market order when the target price is met, and sniper orders by integrating with Solana program logs to detect new pools or migrations and then submitting a market order.

Setup

1. Install dependencies:
   npm install

2. Start Redis and PostgreSQL (e.g., via Docker):
   docker-compose up -d

3. Configure environment:
   cp .env.example .env

4. Initialize database:
   npx tsx src/db/migrate.ts

5. Run the server:
   npm run dev

API

POST /orders/execute
- Upgrade: websocket
- Content-Type: application/json
- Body: { "tokenIn": "SOL", "tokenOut": "USDC", "amount": 0.5, "slippage": 0.01 }

The endpoint returns an orderId via HTTP and upgrades the connection to WebSocket for status streaming.

WebSocket messages are JSON objects with fields:
- orderId: string
- status: "pending" | "routing" | "building" | "submitted" | "confirmed" | "failed"
- txHash (if confirmed)
- error (if failed)
- routedDex (e.g., "raydium" or "meteora")
- executedPrice (if confirmed)
- timestamp

DEX Routing

The system queries mock Raydium and Meteora quotes with simulated latency (200ms) and price variance (2–5%). It selects the DEX with the better output price and logs the decision.

Concurrency and Reliability

- Uses BullMQ with Redis to manage up to 10 concurrent orders.
- Supports 100+ orders per minute.
- Includes retry logic: up to 3 attempts with exponential backoff.
- Failed orders are persisted to PostgreSQL with error details.

Testing

Run tests with:
npm test

Includes ≥10 unit and integration tests covering:
- DEX quote fetching and selection
- Order validation
- WebSocket status transitions
- Queue behavior under load
- Slippage handling
- Retry and failure persistence

Deployment

The app can be deployed on free tiers (e.g., Railway or Render):
- Set PORT, REDIS_URL, DATABASE_URL.
- Run migrations once on first deploy.
- Build with npm run build, start with npm start.
