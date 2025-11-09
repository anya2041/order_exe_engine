# Design Guidelines: Solana DEX Order Execution Engine

## Design Approach

**Selected Approach:** Design System (Developer Tool Focus)  
**Reference Inspiration:** Linear, Vercel Dashboard, Railway  
**Justification:** This is a technical demonstration interface requiring clarity, real-time data visualization, and developer-friendly aesthetics. The focus is on functional excellence, not visual marketing.

---

## Core Design Elements

### A. Typography

**Primary Font:** Inter (Google Fonts CDN)
- Headings: 600 weight, sizes: text-2xl, text-xl, text-lg
- Body: 400 weight, text-base
- Labels: 500 weight, text-sm
- Captions: 400 weight, text-xs

**Monospace Font:** JetBrains Mono (Google Fonts CDN)
- Transaction hashes, order IDs, technical data: text-sm
- Code blocks, JSON responses: text-xs
- WebSocket messages: text-sm

### B. Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4, p-6, p-8
- Section spacing: space-y-6, space-y-8
- Grid gaps: gap-4, gap-6
- Margins: m-2, m-4, mb-8, mt-12

**Container Strategy:**
- Dashboard wrapper: max-w-7xl mx-auto px-6
- Cards/panels: Full width within grid columns
- Forms: max-w-2xl for focused input areas

### C. Component Library

**1. Dashboard Layout**
- Two-column grid on desktop (lg:grid-cols-3)
- Left column (col-span-2): Order submission + real-time feed
- Right column: Active orders sidebar + DEX routing comparison
- Single column stack on mobile

**2. Order Submission Panel**
- Card container with form inputs
- Token pair selectors (dropdowns)
- Amount input with SOL/token toggle
- Slippage tolerance slider
- Large primary CTA button: "Execute Market Order"
- WebSocket connection status indicator (small dot + text)

**3. Real-Time Status Feed**
- Scrollable container (max-h-96, overflow-y-auto)
- Each order displays as expandable card:
  - Order ID (monospace, truncated with copy button)
  - Status badge (pending/routing/building/submitted/confirmed/failed)
  - Progress bar animated during execution
  - Timestamp (relative time format)
  - DEX routing decision (when status = routing)
  - Transaction hash with Solana Explorer link (when confirmed)
  - Error message (if failed)

**4. DEX Routing Comparison Display**
- Side-by-side comparison cards
- Raydium vs Meteora pricing
- Visual indicator (checkmark) on selected DEX
- Price difference percentage highlighted
- Fee comparison
- Update animations when fetching new quotes

**5. Active Orders Sidebar**
- Compact list view showing concurrent orders
- Order count badge (e.g., "3/10 active")
- Mini status indicators per order
- Queue position visualization

**6. Order History Table**
- Sortable columns: Time, Order ID, Type, Status, DEX, Price
- Pagination at bottom
- Filter dropdown by status
- Search by order ID or transaction hash

**7. Navigation**
- Top bar: Logo/title left, connection status right
- Simple horizontal menu: Dashboard | History | Documentation
- No complex navigation needed

**8. Status Badges**
- Pill-shaped with icons from Heroicons
- Pending: Clock icon
- Routing: ArrowsRightLeft icon
- Building: Cog icon
- Submitted: PaperAirplane icon
- Confirmed: CheckCircle icon
- Failed: XCircle icon

**9. Notifications/Toasts**
- Top-right corner position
- Auto-dismiss after 5 seconds
- Success/error states for order submission feedback

### D. Animations

**Minimal, Functional Only:**
- Status badge transitions: fade + scale (200ms)
- Progress bar fill animation: smooth width transition
- WebSocket pulse indicator: subtle opacity pulse
- New order card entry: slide-in from top (300ms)
- No decorative animations

---

## Icons

**Library:** Heroicons (via CDN)
- Solid variants for filled states (badges, buttons)
- Outline variants for line icons (navigation, inputs)

---

## Images

**No hero images required.** This is a functional dashboard, not a marketing page.

**Small Graphics:**
- Raydium logo (via public URL or placeholder)
- Meteora logo (via public URL or placeholder)
- Solana logo in header (32x32px)

Position logos in DEX comparison cards and routing decision displays.

---

## Key UX Patterns

**Real-Time Updates:**
- WebSocket messages append to feed without page refresh
- Smooth scroll to newest order on submission
- Visual pulse on status changes
- Connection lost warning banner at top

**Developer-Friendly Details:**
- All technical IDs copyable on click
- JSON expand/collapse for detailed order data
- Console-style log output option
- Keyboard shortcuts (e.g., Cmd+K to submit order)

**Responsive Behavior:**
- Desktop: Multi-column dashboard layout
- Tablet: Stack sidebar below main content
- Mobile: Single column, collapsible sections

---

## Accessibility

- All form inputs with visible labels
- Status conveyed via text + icons (not color alone)
- Keyboard navigation throughout
- Focus states on all interactive elements
- ARIA labels for WebSocket status indicators
- Sufficient contrast ratios for all text

---

This design prioritizes **clarity, real-time feedback, and technical precision** over visual flair—perfect for demonstrating the backend's sophisticated order routing and execution capabilities.