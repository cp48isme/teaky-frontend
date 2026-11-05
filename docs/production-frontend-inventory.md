# Production frontend inventory — what staff see today, what Andrew sees, and what the backend now serves

Read-only inventory, 4 Nov 2026 (afternoon dispatch, PART B). No design, no proposals. Frontend at `f0abc12` (main); backend at `8443ff3` (main, after spines 1–2). "Reads" are the API modules a page imports (`src/api/*.ts`) and the endpoints those modules call.

## 1. Staff screens that exist today

Routes are from `src/App.tsx:100-250` (the staff shell; buyer-facing `/p/:slug/*` pages are not staff screens and are left out).

| route | component | what it shows | API it reads |
|---|---|---|---|
| `/dashboard` | `DashboardPage` | "Dashboard": stat cards, company profile card, equipment summary, create-portal call to action | `analytics` (`/analytics/summary`), `companyProfiles` (`/company-profiles/by-organization/{org}`), `equipment` (`/equipment`), `portals` (`/portals`) |
| `/get-started` | `GetStartedPage` | onboarding checklist | — (not read for this inventory) |
| `/portals` | `PortalsListPage` | "Portals": the organisation's portals | `portals` (`/portals`) |
| `/portals/create` | `CreatePortalPage` | create a portal, incl. from a description | `portals` (`/portals`, `/portals/create-from-description`), `products` |
| `/portals/:portalId` | `PortalDetailPage` | one portal (name as heading), split-screen layout, breadcrumbs | `portals` (`/portals/{id}`) |
| `/portals/:portalId/products` | `ProductManagementPage` | "Products": the portal's product grid | `portals` (`/portals/{id}/products`) |
| `/portals/:portalId/products/reprice` | `ProductRepricePage` | "Bulk reprice" | `portals`, `products` (`/portals/{id}/products/reprice`, `/category-margins`, `/{product}/confirm-price`) |
| `/orders` | `PrinterOrdersPage` | "Orders": search by order #, RGI # or portal; status filter; the **held queue** table (Order, Group, State, Waiting, Why); the orders list with `release_state` and `rgi_order_number` on each row | `orders` (`GET /orders{query}`), `portals`, `releaseUnits` (`GET /release-units/queue`) |
| `/orders/new` | `NewOrderOnBehalfPage` | "New Order on Behalf" | `orders` (`POST /orders/on-behalf`), `portals`, `products` |
| `/orders/:orderId` | `PrinterOrderDetailPage` | one order: Order, Details, Line Items, Shipping Address, Proofs (with signature capture), Production Status, DocketManager (sync status, manual push), **Release to production** (`ReleaseUnitsPanel`: per unit — state, holds with reason and prior decision, line items, subtotal/tax/freight, frozen/cancelled; release, link, not-found, clear-hold, cancel-held actions), files (`OrderFilesSection`), costs (`OrderCostsPanel`) | `orders` (`GET /orders/{id}`, `/status`, `/production-status`, `/cancel`, `/invoice`, order-level `/release`, `/release/link`, `/release/not-found`), `releaseUnits` (`/release-units/{unit}/release`, `/link`, `/not-found`, `/holds/{hold}/clear`, `/release-units/orders/{id}/cancel-held`), `mis` (`/mis/orders/{id}/sync-status`, `/push`), `proofs` (`/orders/{id}/proofs`, `/proofs/{id}/approve|reject`), `shipping` (`/shipping/tracking/{n}`), `products`, `portals`, `team` (`/team/members`), `orderFiles` (`/orders/{id}/files`), `orderCosts` (`/orders/{id}/costs`, `/line-items/{id}/costs`) |
| `/messages` | `MessageCenterPage` | "Messages" | `client` (direct; `/messages?…`) |
| `/quotes` | `QuotesPage` | "Quote Requests" / "Quote Details" | `quotes` (`/portals/{id}/quotes…`), `portals` |
| `/analytics` | `AnalyticsPage` | "Analytics": date range, revenue and orders charts, fulfillment cards, portal performance, top products | `analytics` (`/analytics/summary`, `/revenue`, `/orders`, `/fulfillment`, `/portal-performance`, `/top-products`) |
| `/agents` | `AgentControlCenterPage` | "Agent Control Center" | `agentTasks` (`/agent-tasks…`, `/agent-control/metrics`) |
| `/agents/:taskId` | `AgentTaskDetailPage` | one agent task, messages, approve/reject draft, takeover | `agentTasks` |
| `/equipment` | `EquipmentPage` | "Equipment" | `equipment` (`/organizations/{org}/equipment…`) |
| `/settings/team` | `settings/TeamPage` | "Invite Team Member", pending and expired invitations, members | `team` (`/team/members`, `/team/invitations…`, `/team/invite`) |
| `/settings/notifications` | `settings/NotificationsPage` | notification preferences | `notifications` (`/notifications/preferences`) |
| `/settings/integrations` | `settings/IntegrationsPage` | "MIS Integration" (settings, test connection, queue mappings, sync log), "QuickBooks Online" | `mis` (`/settings/mis`, `/test-connection`, `/mis/queue-mappings`, `/mis/sync-log`), `quickbooks` (`/integrations/quickbooks/connection`, `/connect`) |
| `/settings/stripe` | `settings/StripeOnboardingPage` | Stripe Connect onboarding/status | `stripe` (`/stripe/connect/status`, `/onboarding`) |
| `/settings/audit-trail` | `settings/AuditTrailPage` | "Audit Trail" with export | `audit` (`/audit-trail{query}`, `/api/audit-trail/export`) |
| `/choose-portal` | `ChoosePortalPage` | portal chooser after login | `auth` |
| (shell) | `LimiterDegradedBanner` | the login rate limiter's degraded banner (fe #72) | `lockouts` (`GET /auth/lockouts/status`, team:manage) |

## 2. What Andrew sees and does, per window (from TaylorProcureInterface `docs/RULES.md`, "What the windows show")

| window | what he sees | what he does |
|---|---|---|
| **MainWindow** (first) | every pulled order: PO, Date, Customers (group), Customer, Category, Products, Lines, Qty, Total, Type, Stock, Batch status, Batch, Slots, Pulled; row colour by batch status; summary line (BC, in batches, waiting, pushed, flagged); filters (free text over everything incl. all_fields; Sprouts / Non-Sprouts; Category; Show: All / BC in batches / BC waiting / Not BC / BC flagged not in batches) | pull by date range, yesterday, next undone day, re-pull, re-pull ALL; refresh batch status; import order_lines.xlsx; set "Batch BC orders created from"; download files for new BC orders; "Batch new BC orders…"; open Batches; open batch folder; right-click: Stock/Category…, Push out this order (status only), Remove pushed mark, Open order history |
| **BatchPlanWindow** (before anything is written) | one row per order: PO, Date, Stock, "Batch N (new)", Slots range, Total, "HELD: reason" in red; header "N placed, M held back"; notes: fill after this plan per batch, every WARNING | Apply (write batches) — all or nothing, no per-row override — or Close |
| **BatchesWindow** (per batch) | Batch, Date tag, Stock, Slots used u/cap, Orders, State (Completed by hand / Pushed out (+N blank) / Pushed out / Full - ready / Open), Docket #, Pushed at, Pushed to, Folder; the selected batch's orders (Slots, PO, Date, Customer); "Show pushed-out batches" | Push out selected batch (with the blanks/full confirmation); Send to Docket (re-send with warning); Half batch… (confirmation lists the POs, the new folder, renumbering); Mark as completed (by hand); Open folder; Refresh from folders; Add order sheets to pushed batches |
| **DetailWindow** | one order: PO, date, customer, type (stock), batch status, slots, pulled at; lines (Line, Product, Description, Qty, Pack, Line total, Portal status); every stored field of the selected line (all_fields) | read only |
| **ProductOrdersWindow** | every pulled order containing one product | double-click opens the order |
| **CategoriesWindow** | the categories; "Only Business Cards is batched" | add a category; remove one no product uses |
| **StockWindow ("Products")** | per product: Category, Stock (editable combo: the four standard BC stocks + every stock seen, free text), "Not in batches" tick, Status (Needs a category / Needs a stock / OK - not in batches / OK); filter needs category or stock / complete / not in batches / all; search | set category and stock; exclude from batching; import Product_Stock_Matching.xlsx / products .csv |
| **SettingsWindow** | app data folder, batch folder, push-out folder, blank page, "Use the original PO pdf", "Clear pulled data…" | change those; Docket settings are in settings.json only |

## 3. Andrew's windows against the API that exists on the backend after spines 1–2

"Exists" means a route in `src/server/routes/` on main `8443ff3`. Engine-only means the logic is merged (pure functions or a service) and no route serves it.

| his window / action | backend after spines 1–2 | route today | status |
|---|---|---|---|
| MainWindow — the order grid (PO, date, customer, products, qty, stock, batch status, batch, slots) | pool lines: `ReleaseUnitRepository.pool()`; press-run lines `PressRunLine` (spine 1); `derive_order_release_state` | `GET /orders` (order rows with `release_state`, `rgi_order_number`; no unit summary on list rows) | **no pool-line API** — the list serves orders, not pool lines; no stock, batch or slot columns |
| MainWindow — summary counts (BC, in batches, waiting, pushed, flagged) | `PressRunAdvice` (`unplaced_count`, `unplaced_oldest_age`), `held_queue` | `GET /release-units/queue` (held entries only) | **partial** — held queue only; no counts of placed/pushed/unplaced |
| MainWindow — filters (Sprouts / category / show) | the Taylor group is on the fixture rows (`grp`), not on a pool line; categories are the spec library's `product_key` + stock | — | **no API** |
| MainWindow — pull / re-pull / import order_lines.xlsx | spine 3a normaliser (offline; this dispatch, PR open) | — | **no API** (and no HTTP to Taylor by rule) |
| MainWindow — Stock/Category… per product | spec library (spine 2 A): `SpecLibraryService.assert_value / propose_from_docket / seed_import / suggest / history`; `clear_hold` STOCK_UNKNOWN writes the person's row | `POST /release-units/{unit}/holds/{hold}/clear` (the STOCK_UNKNOWN branch takes the answer) | **partial** — the answer reaches the library only through a hold clear; no spec-library route (no list, no assert, no history, no suggest) |
| MainWindow — "Push out this order" / "Remove pushed mark" | `pin_order` (improvement 11), `OrderPin` | — | **no API** |
| BatchPlanWindow — the plan (placed rows, held rows with reason, fill after, warnings) | `replan`, `advice`, `hold_notices` / `WAITS_ON`, `PressRunHold` with reason/age/owner (spine 1, D) | — | **no API** (engine only) |
| BatchPlanWindow — Apply | `act_on_plan` (planner), `place_line` | — | **no API** |
| BatchesWindow — the batch grid and state | `PressRunUnit` (`slot_ranges`, `unaccounted_slots`), `PressRunState` | `GET /orders/{id}` carries `release_units[]` for **one order**; `ReleaseUnitsPanel` renders them | **no unit list API** — units are reachable only through their order |
| BatchesWindow — Push out (names, blanks, sheet) | `output_names`, `render_unit_names`, `render_order_sheet`, `sheet_totals`, `shop_name` (spine 2 B) | — | **no API**; no file writes by rule |
| BatchesWindow — Send to Docket / Docket # | `build_docket_payload`, `send_to_docket` idempotent, `docketmanager/order_number` reference (spine 2 E) | `POST /release-units/{unit}/release` (the RGI path's push), `/link`, `/not-found` | **partial** — release exists for RGI units; the Taylor channel's Docket send has no route and no live sender |
| BatchesWindow — Half batch… | `move_orders`, `choose_oldest_that_fit` | `POST /release-units/move-lines` | **partial** — a person can move lines between units; no half-batch operation |
| BatchesWindow — Mark as completed | — | — | **no API** |
| BatchesWindow — holds per batch (stock unknown, mixed, exceeds capacity, art missing) | `HoldReason.STOCK_UNKNOWN / STOCK_MIXED / EXCEEDS_CAPACITY / ART_MISSING`, `hold_line`, `release_line_hold` | `GET /release-units/queue`, `POST …/holds/{hold}/clear` | **exists** for unit holds; line-level holds (improvement 11) have no route |
| DetailWindow — one order with every stored field | `TaylorCanonicalLine` (extras, variable data, scrubbed paths — spine 3a) | `GET /orders/{id}` | **partial** — the order detail exists; no canonical-line read with extras/variable data |
| ProductOrdersWindow — orders by product | — | — | **no API** |
| CategoriesWindow | spec library's `product_key` prefix; `CanonicalSpec` | — | **no API** |
| StockWindow — products, stock, excluded, status; import | spec library: `all_current`, `proposals`, `history`, `seed_import` (`IMPORT_EVIDENCE_FROM`), `suggest_stock` a/b/c evidence (spine 1 C) | — | **no API** |
| SettingsWindow — folders, blank page | `organizations.press_run_config` (`PressRunConfig`: slots, cards per slot, half capacity, first number, shop_name, hold_age_days, channels with Docket customer, item codes) | — | **no API** (JSONB set by the operator's SQL) |

What has an API today, in one line: order list and detail (with units on detail), the held queue, unit release / link / not-found / clear-hold / move-lines / cancel-held, and the MIS sync status and push. Everything that is Andrew's plan, batch grid, stock table, settings and pull has engine or service code and no route.
