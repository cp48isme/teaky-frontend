Draft for Clayton's edit — 25 November 2026

# RGI admin: the day across the hotels

For RGI's administrator, signed in as the shop's **Printer Admin**: the portals, the team, the orders from every hotel, the proofs, the invoices, the costs and the numbers. The screens are the shop's; this is the walk through them in a working day. Every word in bold is a word on the screen.

## Signing in

1. On the **Sign in** card type your **Email** and **Password** and press **Sign in**.
2. You land on the floor's **Batches**. Press the mark at the top left, or **← Dashboard**, for the shop side; press **Production** in the shop side's menu to come back to the floor.
3. **Dashboard** shows **Active Portals**, **Orders**, **Revenue**, **Pending Proofs** and **Held for proof** ("N approved — ready to release" when something waits for you).

## Your hotels: the portals

1. Press **Portals**. Each hotel is a card: its name, its status (active, draft, paused, archived), **Template** or **Multi-location**, its address (app.teakygrove.com/p/…).
2. Press a hotel. **Details** shows **Slug**, **Type**, **Approval**, **Require PO**, **Customer classification** (Existing (RGI account before Teaky), Teaky-sold, RGI-sold) and **Revenue share rate**. The last two are set once, with **Set once** and **Confirm — set once**; "These cannot be changed in place afterwards."
3. **Open storefront** shows the ordering page as the hotel sees it. **Manage Products** opens that hotel's catalogue (prices per pack, **Cost**, **Markup**, **Floor**, **Lead time**, **Outsourced**, **Max packs**, **Prev. DM order #**, **Status**).
4. To add a new location from a template hotel press **+ Duplicate for New Location**: **Location Name**, an optional **Custom Subdomain**, **Duplicate**.
5. To bring a hotel's buyer on: under **Invite Users** type the address, choose **End User** or **Portal Admin**, press **Invite**. The invitation appears under **Pending Invitations** until it is accepted.

## Your team

1. Press **Settings** → **Team**. **Invite Team Member**: the **Email**, the **Role** (Printer Admin, Portal Creator, Sales Rep, Sales Team Lead, Billing Contact, Portal Admin, Sub-Portal Admin), **Send Invite**.
2. **Team Members** lists **Name**, **Email**, **Role**, **Portals** and **Actions**. **Edit** changes a name or role; **Admin…** opens the Admin tab.
3. On **Admin**, deactivating, reactivating, removing or changing a role is a proposal with a reason: press **Deactivate**, **Reactivate**, **Change role** or **Remove** on the member, type **Why (kept with the record)**, press **Propose**. Under **Proposals**, **Approve** or **Decline** it (with the **Second approver** switch on, the proposer sees **Withdraw** and someone else approves).
4. **Pending invitations** on the same tab offers **Resend** and **Revoke**, each as a proposal too.

## Orders across the hotels

1. Press **Orders**. Every hotel's orders are in one list: **Order**, **RGI #**, **Portal**, **Date**, **Items**, **Total**, **Status**.
2. **Search by order #, RGI # or portal** to find one hotel's orders.
3. **Missing RGI order #** lists the orders nobody has given an RGI number yet ("none" in amber). Open the order, type the **RGI order #** under **Details** and press **Save**.
4. **Held for proof** lists what waits on the desk: **Groups waiting on the desk — oldest first, unknown outcomes on top**, with **Order**, **Group**, **State**, **Waiting** and **Why**.
5. The other filters are the statuses: **Submitted**, **Pending Approval**, **Approved**, **In Production**, **Quality Check**, **Shipped**, **Delivered**, **Completed**, **Cancelled**.
6. On an order, **Order** shows **Portal**, **Placed by**, **Customer PO**, **Needed by**, **Proofs go to** and **Placed**; **Line Items** shows each line, its artwork note and "Proof: needed / approved / rejected"; **Shipping Address** and **Tracking** sit beside **Details**.
7. **New Order** places an order on a hotel's behalf; it is marked "Staff-assisted order (placed on behalf of customer)".

## Proofs

1. A line that needs a proof holds its group: "Held for a proof. Nothing has been sent to DocketManager." On the floor's **Held** page it is **Proof not approved** — "Waiting on: the buyer", "Clears on approval".
2. On the order, under **Proofs**, choose the **Line Item**, paste the **Proof File URL** and press **Submit Proof** ("Proof submitted"). The buyer gets it at the address under **Proofs go to**.
3. When the hotel approves, record it: on the proof press **Approve with Signature**, sign ("Draw your signature below to approve this proof."), press **Submit Signature** ("Proof approved"). If the hotel wants changes, type the **Reason...** and press **Reject** ("Proof rejected"); submit the next version the same way.
4. The group's hold reads "Waiting for proof approval: …". Once the proof is approved the card reads "Proof approved. Nothing has been sent to DocketManager yet." and offers **Release to production** (or **Release this group to production**). Press it: "Released: in DocketManager as order #…".
5. If the hotel approved outside Teaky, clear the hold by hand: choose **Approved how** (by email, by phone, in person, other), type "who approved, and when", press **Record the approval and clear this hold**. The record then reads "Released without a proof in Teaky — approved by email: …".
6. Buyers do not approve a proof on their ordering page today; the ordering page only tells them "Waiting for your proof: … Nothing in this group prints until you approve it."

## Invoices

1. Every hotel is on invoice terms: the buyer sees "You will be invoiced for this order. No payment is taken now." and freight as "Billed at cost on your invoice".
2. On an order, under **Details**, press **Download Invoice**; the file downloads.
3. Under **Settings** → **Integrations** → **QuickBooks Online**, once connected: "Invoices are automatically created in QuickBooks when orders are placed."
4. On a split order each group is invoiced separately; the buyer is told "These groups ship and are invoiced separately, each with its own freight charge."

## Costs and gross profit

1. On an order, **Costs and gross profit** is RGI's own panel: "Costs are the printer's own. Buyers never see this panel."
2. Per line, fill **Cost / pack**, **Cost source**, **Decoration** and **Inbound freight**, and press **Save line**. For the order, fill **Outbound freight (label cost)**, **Processing fee**, **Fee source** and **Invoice month** ("Set to the ship month when the order ships."), and press **Save order costs**.
3. The line above the table reads "Price … · Cost of goods … · Freight … · GP …" once every line has a cost; until then "GP cost not recorded (N of M lines have no cost)". The share rate is shown beside it when the hotel has one.
4. On the hotel's products, **Cost** is the vendor cost per pack and **Markup** is what the published price gives today; **Below floor — decide** asks for **Keep price** or a new price. **Bulk reprice** sets prices from cost plus a margin, preview first.

## Reports

1. **Dashboard**: **Active Portals**, **Orders**, **Revenue**, **Pending Proofs**, **Held for proof**; **View detailed analytics →**.
2. **Analytics**: pick the dates and the grain at the top right; the cards are **Total Revenue**, **Total Orders**, **Avg Order Value** and **Pending Proofs**, followed by revenue over time, orders over time, the top products by revenue and by quantity, portal performance per hotel, and fulfilment.
3. **Settings** → **Audit Trail**: filter by **Action**, **Resource Type**, **Start Date**, **End Date**; **Export CSV** or **Export JSON**.
4. The floor's **All Channel Orders** counts **Waiting for a batch**, **In open batches**, **Held** and **Order → received** across every channel, and **Where did … go** on any order shows its units, scans, lines and pushes to Docket.
