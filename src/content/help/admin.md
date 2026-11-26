Draft for Clayton's edit — 25 November 2026

# Running the shop

For the shop's administrator: the person who sets the shop up, keeps the team and the portals in order, and runs the orders. Every word in bold is a word on the screen.

## Signing in and finding your way

1. Open the sign-in page. On the **Sign in** card type your **Email** and **Password** and press **Sign in**. **Forgot your password?** sends a reset.
2. Staff land on the floor's **Batches**; press the shop's mark at the top left, or **← Dashboard**, for the shop side.
3. The shop side's menu on the left: **Dashboard**, **Production** (for a sign-in with a floor role), **Portals**, **Orders**, **Quotes**, **Analytics**, **Agents**, **Messages**, **Settings**. (**Equipment** appears only on a self-serve shop with no portal yet.)
4. The bell at the top right lists **Notifications**: press **Read** on one, **Mark all read**, or **View all notifications**.
5. The round button with your initials opens **Account**, **Settings** and **Sign out**.
6. **Dashboard** shows **Active Portals**, **Orders**, **Revenue**, **Pending Proofs** and **Held for proof** ("N approved — ready to release", or "Not yet in DocketManager"), with **View detailed analytics →**.

## Portals: one per hotel

1. Press **Portals**. Each card shows the portal's name, its status (active, draft, paused, archived), **Template** or **Multi-location** where it applies, its address (app.teakygrove.com/p/…), its type and when it was created. **+ Create Portal** starts a new one; with none yet: "No portals yet" and **Create Portal**.
2. Press a portal. The header offers **Open storefront**, **Publish** (while the portal is a draft) and, on a template, **+ Duplicate for New Location**.
3. **Details** lists **Slug**, **Type**, **Created Via**, **Approval**, **Self-Registration**, **Require PO**, **Customer classification** and **Revenue share rate**.
4. Until they are set, choose a **Classification** (Existing (RGI account before Teaky), Teaky-sold, RGI-sold) and type a **Share rate (%)**, then press **Set once**. "These cannot be changed in place afterwards." Read the restatement ("Set once, for … This cannot be changed in place afterwards.") and press **Confirm — set once**, or **Go back**.
5. **Branding** shows the **Logo** and the **Colors** ("No colors configured" when there are none).
6. **Manage Products** opens the portal's products. **Open storefront →** opens the ordering page as a buyer sees it.
7. **Invite Users**: type the address, choose **End User** or **Portal Admin**, press **Invite**. **Pending Invitations** lists what has been sent and not yet accepted.
8. **Duplicate Portal** (from a template): type the **Location Name** and, if you want one, a **Custom Subdomain** ("Leave blank to auto-generate from location name"); press **Duplicate**. The new portal's page opens.

## Products on a portal

1. From the portal press **Manage Products**. The page is headed **Products**, with **Open storefront** beside it and the storefront previewed on the right.
2. **+ Add Product** adds a row named "New Product". **Import from File** uploads a file ("File uploaded. Processing will be implemented soon."). **Bulk reprice** opens the repricing page. **Group by category** groups the rows. **Missing DocketManager order #** keeps only products with none on file. **Search products...** filters by name, category or code.
3. The columns are **Image**, **Name**, **Category**, **Price / pack**, **Cost**, **Markup**, **Floor**, **Pack size**, **Max packs**, **Lead time**, **Outsourced**, **Prev. DM order #**, **Status**, **Actions**. Press a cell to edit it; Enter saves, Escape cancels; the notice names the column ("Price saved", "Max packs saved").
4. **Cost** is the vendor cost per pack, never shown to buyers; "cost not recorded" is amber. **Markup** is what the published price gives today; type a multiplier to re-price from cost. **Floor** is the lowest acceptable markup; below it the row reads **Below floor — decide** and offers **Keep price** ("Keep the hotel's price as it is and record today as its confirmed date").
5. **Max packs** is the most a buyer may order per order ("no cap" when blank). **Lead time** is **2–5 days** or **7–10 days** ("not set" is amber and holds the order's group). **Outsourced** — "yes — its own group" — never shares a shipment.
6. **Status** is **Draft (not for sale)**, **Active (on the storefront)** or **Archived**. A draft cannot be activated without a price; the notice says why.
7. **Options** opens **Options for …**: an **Option name** (for example "Locking system") and rows of **Label**, **Cost**, **Price / pack**, **Floor ×** and **Markup**; **+ Add option**, **Remove**, **Save options**. "The buyer must pick one; they see the label and price only."
8. Tick rows to get **Change Category**, **Change Price** and **Delete Selected**. **Delete** on a row removes that product.
9. **Bulk reprice**: "Sets each product's price to its cost plus a margin. Preview first; nothing changes until you apply. Prices set by hand are skipped unless you include them." Choose a **Category** (or **All categories**), type the **Margin over cost (%)**, tick **Also overwrite prices set by hand** if you mean to, and press **Preview changes**. Read the **Preview** table (**Product**, **Category**, **Cost**, **Current**, **New**, **Note** — "No cost on file" or "Price set by hand (locked)"); then press **Apply to N product(s)**. "Nothing has been written." until you do.

## Orders

1. Press **Orders**. **New Order** opens a form to place an order on a hotel's behalf. **Search by order #, RGI # or portal**.
2. The filters: **All**, **Missing RGI order #**, **Held for proof**, **Submitted**, **Pending Approval**, **Approved**, **In Production**, **Quality Check**, **Shipped**, **Delivered**, **Completed**, **Cancelled**.
3. The columns: **Order**, **RGI #** ("none" in amber when not yet assigned), **Portal**, **Date**, **Items**, **Total**, **Status**. A held order carries "Held for proof", "Releasing…", "Release failed — retry" or "Check DocketManager" beside its status.
4. Under **Held for proof**, the box **Groups waiting on the desk — oldest first, unknown outcomes on top** lists **Order**, **Group**, **State**, **Waiting** and **Why**.
5. Press an order number. The page shows the number, its production status and status pills, then the panels below.
6. **Release to production** (or one card per group when the order has groups): the headline says where it stands — "Held for a proof. Nothing has been sent to DocketManager.", "Proof approved. Nothing has been sent to DocketManager yet.", "Released: in DocketManager as order #…", "Release attempt N did not make the job…" or "The release outcome is unknown…". Press **Release to production** (or **Release again**) when it is offered. When the outcome is unknown, check DocketManager and either type the **DocketManager order number** and press **It is there — record the number**, or press **Not there — allow a new release** (on a group card: **It is not there**).
7. A group's open hold reads, for example, "Waiting for proof approval: …". To clear it by hand choose **Approved how** (by email, by phone, in person, other), type "who approved, and when", and press **Record the approval and clear this hold**. A missing lead time asks for **Lead time** and **Set the lead time and clear this hold**. "Last time this came up (date) the answer was …" shows a remembered answer. **Release this group to production** sends the group. **Cancel the held groups only (the released ones stay)** with a reason and **Cancel held groups** drops what is still held.
8. The status buttons move the order along (**pending approval**, **approved**, **in production**, **quality check**, **shipped**, **delivered**, **completed**); **Cancel Order** asks for a reason ("This action cannot be undone. Please provide a reason.") and **Confirm Cancel**. "Staff-assisted order (placed on behalf of customer)" marks an order placed for the buyer.
9. **Costs and gross profit**: per line, **Price / pack**, **Cost / pack**, **Cost source**, **Decoration**, **Inbound freight** and **Save line**; for the order, **Outbound freight (label cost)**, **Processing fee**, **Fee source**, **Invoice month** ("Set to the ship month when the order ships.") and **Save order costs**. The line above reads "Price … · Cost of goods … · GP …", or "GP cost not recorded (N of M lines have no cost)". "Costs are the printer's own. Buyers never see this panel."
10. **Production Status** (on approved and in-production orders): **received**, **in prepress**, **printing**, **finishing**, **quality check**, **ready to ship**, **shipped**, **picked up**, with **Production Notes**.
11. **Order** shows **Portal**, **Placed by**, **Customer PO**, **Needed by**, **Proofs go to** and **Placed**. **Line Items** lists each line with its artwork note ("ART CHANGES — new proof required before press", "Exact reprint of the approved art — no proof", "No artwork — no proof"), "Changes: …", **New art uploaded by the buyer**, "Proof: needed / approved / rejected", and the totals.
12. **Shipping Address** and, with a tracking number, **Tracking** (**Status**, **Carrier**, **Est. Delivery**).
13. **Details**: **RGI order #** ("not yet assigned"), **Tracking Number**, **Tags**, **Notes**, **Save** and **Download Invoice**.
14. **Files**: "Drop files here or click to upload" ("PDF, images, or any relevant order files"); **Delete** removes one. "No files attached." before the first.
15. **DocketManager**: the latest attempt ("Not sent to DocketManager yet.", "In DocketManager as order #…", "Held in Teaky: nothing has been sent to DocketManager.", "Held: a product on this order has no cost per pack…") and **Push to DocketManager** when it applies. "This order reaches DocketManager only through "Release to production" above." or "Push is unavailable until every product on this order has a cost per pack."
16. **Proofs** (when a line needs one): choose the **Line Item**, paste the **Proof File URL** and press **Submit Proof**. Each proof shows **Version N**, its status (pending, approved, rejected), **View File**; **Approve with Signature** opens "Draw your signature below to approve this proof." with **Clear** and **Submit Signature**; type a **Reason...** and press **Reject** to send it back.

## Tags

1. On the floor's **All Channel Orders**, under an order number: **+ tag**, then **Pick a tag…** or type a **New tag** and **Add**; **×** removes one; **Done** closes the editor.
2. On an order's page, under **Details** → **Tags**, the same editor; every change is saved at once.
3. On the floor's **Batches** in the **List** view, the **Tags** column tags every order in the batch at once: the box names the count ("Tag 3 orders with rush" or "Remove rush from 3 orders") and nothing is written until **Confirm**; **Cancel** drops it. The notice reads "Tagged 3 orders with rush." or, if it stopped, which orders changed and which did not.
4. Rules that tag new orders by customer live on the floor's **Settings** page under **Tags by customer** (see "Floor settings" below).

## Settings

Press **Settings**. The tabs are **Company**, **Team**, **Admin** (the shop's printer admin only), **Notifications**, **Integrations**, **Stripe** and **Audit Trail**.

### Company

1. **Shop** — "The name and mark your team, your buyers and your emails see." **Upload logo** or type a **Logo URL**; set the **Display name**.
2. **Contact details** — **Website**, **Phone**, **Address line 1**, **Address line 2**, **City**, **State / region**, **Postal code**, **Country**. Press **Save**. "Only a shop admin can change them."

### Team

1. **Invite Team Member**: the **Email**, a **Role** (Printer Admin, Portal Creator, Sales Rep, Sales Team Lead, Billing Contact, Portal Admin, Sub-Portal Admin), **Send Invite**.
2. **Pending Invitations** lists each with **Revoke**. **Expired Invitations** — "The link in each of these has stopped working. Send a new invitation if the person still needs one."
3. **Team Members**: **Name**, **Email**, **Role**, **Portals** ("All" when unrestricted), **Actions**. **Edit** changes the name ("Shown on invitations they send") and the role; **Save** or **Cancel**. **Admin…** goes to the Admin tab, where removing, deactivating or changing a role is proposed with a reason.

### Admin: members, invitations, proposals, the second approver

1. **Second approver** — "With a switch on, the person who proposes an act cannot be the one who approves it. Both are off unless you turn them on." The two switches: **Floor acts (void, push alone, short run, mark done)** and **Admin acts (deactivate, remove, role changes, invitations)**.
2. **Members**: **Name**, **Email**, **Roles**, **Active** ("Yes" or "Deactivated"), **Last sign-in**, **Sessions**, and per member **Deactivate** (or **Reactivate**), **Change role** and **Remove**. Your own row reads "never on yourself".
3. **Pending invitations**: **Email**, **Role**, **Sent**, **Expires**, with **Resend** and **Revoke**. "None pending." when there are none.
4. Pressing any of those opens the proposal box, headed for example **Remove from shop: name**. "Nothing happens until it is approved. Approving drops their roles on this shop only; their account and history stay." (Each act states its own effect.) For **Change role** choose the **New role**. Type **Why (kept with the record)** and press **Propose**, or **Cancel**.
5. **Proposals** lists what waits: the act, who proposed it and when, the reason in quotes, and "At the time: …" (roles, active or not, last sign-in, open sessions). Type a note if you want and press **Approve** or **Decline** (your own, with the switch on, reads **Withdraw**). "Nothing waiting for a decision." when empty. **Decided (N)** opens the history.
6. Anyone who is not the printer admin sees "The admin surface is the shop owner's (printer admin). You can see the team on the Team tab."

### Notifications

1. The **Notifications** tab lists them; tick **Unread only**, press **Mark read** on one or **Mark all as read**. "No notifications" when empty.
2. The **Preferences** tab is a table of **Event Type** against **In-App** and **Email**: Order Placed, Order Status Changed, Order Created on Behalf, Order Files Uploaded, Proof Needed, Proof Approved, Proof Rejected, Quote Requested, Quote Provided, Quote Accepted, Invitation Received, Team Member Joined, Agent Escalation, Agent Takeover Available. Tick or untick each.

### Integrations

1. **MIS Integration** — choose the **MIS Provider**: None, DocketManager, Printavo, shopVOX, Manual / CSV Export, Webhook Integration. For DocketManager: **Account URL** and **API Key**. Tick **Auto-push orders on approval** if wanted. **Save Settings**; **Test Connection** answers "Connection successful!" or "Connection failed".
2. With DocketManager: **Webhook Configuration** (the **Webhook URL** to give DocketManager, and a **Webhook Secret**) and **Queue Mapping** ("Map DocketManager queue names to Teaky order statuses."): type a **DM Queue Name**, choose a **Teaky Status**, press **Add**, then **Save Queue Mappings**.
3. **Recent Sync Log**: press **Load** (then **Refresh**) for **Time**, **Action**, **Entity**, **Status**, **Error**.
4. **QuickBooks Online** — **Connect QuickBooks**; once connected, "Invoices are automatically created in QuickBooks when orders are placed."

### Stripe

The **Stripe** tab: "Connect your Stripe account to receive payments from orders." Every portal is on invoice terms today, so no buyer pays by card.

### Audit Trail

1. Filter by **Action** (for example user_logged_in), **Resource Type** (for example order), **Start Date** and **End Date**; press **Search** or **Clear**.
2. The table: **Timestamp**, **Action**, **Resource**, **User ID**, **Details**; **Prev** and **Next** page through it. "No audit trail entries found matching your filters." when empty.
3. **Export CSV** and **Export JSON** download the filtered trail. These are the shop's exports today, with **Download Invoice** on an order and the **Shipping row** file on a picked stocked-goods PO.

## Floor settings: the press, the bridge, the tags

1. From the floor's menu press **Settings** (**Production settings**).
2. **Batches opens as** — **Cards** or **List**: "The shop's default; a browser's own toggle on Batches overrides it there."
3. **Bridge writes batch files to the job-tickets folder** — **Off** or **On**. "Off (the default): the bridge on the shop's PC is offered no batch files and writes nothing; it only keeps the Taylor session. Switching it on is a deliberate step taken together with the shop, and every change is recorded with who made it." There is no screen for the bridge's own token today; it is set up with Teaky.
4. **Tags by customer** — **Add rule**, then the customer ("Customer, as the channel names it"), the channel (**Every channel**, taylor, inspire, pagedna) and the tags ("Tags, comma-separated"); **Save rules**. "Every rule needs a customer and at least one tag."
5. The press run's own settings — the slots per batch, the sheets per run and the Docket item code for each stock — have no screen today. The stocks they name appear as the choices in the floor's **Products** dropdown.
