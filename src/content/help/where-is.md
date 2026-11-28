# Where is…

One line per thing a person can see, from rev 43 to rev 48: what you are looking for → which shell → the page and how you get there → who sees it. The shells are **the floor** (the production screens), **the shop side** (Dashboard, Portals, Orders, Settings) and **the ordering page** (a hotel's own page). Words in bold are the words on the screen. The search box on the Help page looks through this table and the four walks.

## Getting between the shells

| What you are looking for | Shell | Page (how you get there) | Who sees it |
|---|---|---|---|
| The way to the floor | the shop side | **Production floor →** in the header, or **Production** in the menu | staff whose shop has a floor |
| The way to the shop side | the floor | **← Shop admin** in the header, or **← Dashboard** in the menu | staff |
| This manual | all three | the **?** in the header (the floor and the shop side), or **Help** in the footer of every page | everyone |
| Your **Account**: change password, **Sessions**, **Sign out everywhere** | all three | the round button with your initials → **Account** (the floor also has **Account · sign out** at the foot of its menu; the ordering page has **Account** in its header) | everyone |
| **Theme: System / Light / Dark** | the floor | the round button with your initials → **Theme** | everyone on the floor |
| The shop's own mark and **Powered by Teaky** | the floor | the dark bar at the top of every floor page | everyone on the floor |

## Orders, batches and what happens to them

| What you are looking for | Shell | Page (how you get there) | Who sees it |
|---|---|---|---|
| Every order from every channel, with its **Lane** (Press run / Stocked goods), **Customer** and tags | the floor | **All Channel Orders** (also the shop side's menu item of that name) | printer admin; the read-only sign-in |
| **Where did this order go** (its units, scans, what was pushed, what it waits on) | the floor | **All Channel Orders** → the order's **where** link | printer admin; read-only |
| A batch: its lines, what goes with it (job ticket, imposed sheet, art), its actions, its proposals, its audit trail | the floor | **Batches** → the card or the row → the batch page | printer admin; read-only reads |
| Batches as **Cards** or a **List**; **Open · Pushed out · Done · All**; the search | the floor | **Batches** | printer admin; read-only |
| **Push out** a batch: the files, the blanks and the Docket order shown first; one **Confirm** | the floor | the batch page → **Push out** → the confirmation page | printer admin |
| Whether a push-out is **sent to DocketManager or only recorded** (the Docket send switch) | the floor | the banner on the push-out page; the switch itself is Settings → **Integrations** on the shop side | printer admin |
| **Mark done** (a batch finished by hand, with a reason) | the floor | the batch page → **Mark done…** | printer admin |
| A **half batch** (12 slots), and what stays / what goes back to the pool | the floor | the batch page → **Propose a short run** → the proposal | printer admin |
| **Proposals**: propose with a reason, approve, decline, withdraw; **Waiting** and **Decided** | the floor | **Batches** → **Proposals** (the one home); a batch's own proposals on its page | printer admin; read-only reads |
| Propose something for a **held order** without finding it again | the floor | **Held** → the order's **Propose…** link (opens the form on Batches, filled in) | printer admin |
| Why an action was **refused** | the floor | in words, beside the button that was pressed | printer admin |
| **Held** orders: stock unknown, two stocks, oversize, proof not approved, missing art; **Split by stock**, **Always split** | the floor | **Held** | printer admin |
| Tags on an order: the chips, the filter, editing them | the floor | **All Channel Orders** and **Batches** (the row's editor); the shop side's order page → **Details** | printer admin |
| **Tags by customer** (the rule intake applies) | the shop side | **Settings** → **Floor** → **Tags by customer** | printer admin |
| **Stocked goods**: to pick / picked, **Mark picked…**, the shipping row file | the floor | **Stocked goods** | printer admin |
| The **stock ruling** for a product (the one dropdown; the history behind **Details**) | the floor | **Products** | printer admin |
| The station view: scan **Arrived** / **Done**, **hold this batch** | the floor | **Floor** | printer admin |
| **Batches opens as** Cards or List for the whole shop; **Bridge writes batch files** off / on | the shop side | **Settings** → **Floor** | printer admin |

## The shop side

| What you are looking for | Shell | Page (how you get there) | Who sees it |
|---|---|---|---|
| **Dashboard** counts: Active Portals, Orders, Revenue, Pending Proofs, **Held for proof** | the shop side | **Dashboard** | every staff role |
| Hotel orders: search by **order #, RGI # or portal**; **Missing RGI order #**; **Held for proof** | the shop side | **Dashboard** → the **Orders** card, or a hotel's portal → its orders (the menu says **Orders** when the shop has no floor) | every staff role |
| **RGI order #**, **Download Invoice**, the order's tags | the shop side | the hotel order → **Details** | staff |
| **Proofs**: Submit Proof, Approve with Signature, Reject | the shop side | the hotel order → **Proofs** | printer admin, sales roles |
| **Costs and gross profit** | the shop side | the hotel order → the costs panel | staff with costs (never buyers) |
| The hotels: a portal's details, **Set once** classification and share rate, **Invite Users**, **Manage Products**, **Open storefront** | the shop side | **Portals** → the hotel | every staff role |
| The team: **Invite Team Member**, roles, **Edit**, **Admin…**; **Revoke** an invitation | the shop side | **Settings** → **Team** | printer admin invites; others read |
| Members' state, last sign-in, sessions; **Deactivate / Reactivate / Change role / Remove** as proposals; **Resend / Revoke** an invitation; the **Second approver** switches | the shop side | **Settings** → **Admin** | printer admin only |
| The shop's **Company** page: name, logo, contact details (the address staff invitations reply to) | the shop side | **Settings** → **Company** | printer admin edits; others read |
| **Notifications** and their preferences | the shop side | the bell → **View all**, or **Settings** → **Notifications** | every staff role |
| **Integrations** (DocketManager and its send switch, QuickBooks) | the shop side | **Settings** → **Integrations** | printer admin |
| The **Audit Trail** (filters, **Export CSV / JSON**) | the shop side | **Settings** → **Audit Trail**; a batch's own trail is on its page | printer admin |
| **Report a bug**, **Privacy**, **Terms**, **Contact Teaky**, **Help** | all three | the footer of every page | everyone |

## The ordering page

| What you are looking for | Shell | Page (how you get there) | Who sees it |
|---|---|---|---|
| **Products**, a product's packs and artwork, **Cart**, **Checkout**, **My Orders**, an order's groups and **Proof: pending / approved**, **Reorder** | the ordering page | the hotel's page → its header | the hotel's buyers |
| Signing in; a forgotten password | — | **Sign in** (`/login`) | everyone |

*Not on any screen (nothing to point at):* the production export, the bridge's history upload, the security headers, the access matrix, the scanners, the probe rows, the critical-path suite, the OpenAPI types, the frontend pin.
