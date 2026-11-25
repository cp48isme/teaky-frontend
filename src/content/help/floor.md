Draft for Clayton's edit — 25 November 2026

# On the production floor

For the person at a press, a cutter or the bench, and for whoever runs the Batches screen. Every word in bold is a word on the screen.

## Signing in

1. Open the link the shop gave you. You see the **Sign in** card, with "Your ordering portal and orders" under the heading.
2. Type your **Email** and **Password** and press **Sign in**. If you have forgotten it, press **Forgot your password?** under the password box.
3. Staff land on **Batches**. (A buyer lands on their ordering page, not here.)
4. The dark bar across the top carries the shop's own mark with **Powered by Teaky** beside it, or Teaky's mark alone. Pressing the mark takes you to the Dashboard.
5. The brown column on the left is the floor's menu: **← Dashboard**, **All Channel Orders**, **Batches**, **Held**, **Stocked goods**, **Products**, **Floor**, **Settings**, and at the bottom **Account · sign out**.
6. If your sign-in is read-only, the menu shows only **All Channel Orders**, **Batches** and **Held**, with the note **Read-only view**, and no button acts.

## Your account menu and dark mode

1. Press the round button with your initials at the top right. The menu names you and shows your email.
2. **Account** opens your account page: **Current password**, **New password**, **New password, again**, **Change password**; your **Sessions**; **Sign out** and **Sign out everywhere**. **Back** returns you here.
3. Under **Theme**, press **System**, **Light** or **Dark**. The floor's screens follow your choice; **System** follows the device's own setting.
4. **Settings** opens the shop's settings. **Sign out** ends your session at once.

## Batches

1. Press **Batches**. The line beside the heading reads, for example, "3 open · 1 full and ready · next number 12".
2. **Cards** or **List** at the right switches the view. The shop's default is set under Settings; your choice here is remembered in this browser.
3. **Show** picks **Open**, **Pushed out**, **Done** or **All**. **Search** matches "PO, product, any field".
4. If any batch carries tags, a **Tags** row shows them. Press a tag once to keep only those batches, twice to hide them, a third time to clear.
5. Each card shows **Batch** (its number), **Stock**, **Slots** (for example "18 / 24 · 6 blank if pushed out now", or "full"), **Orders**, **Oldest line**, **Scan code** and **Entity**.
6. The strip of 24 boxes on the card is the batch: green boxes are filled, orange boxes could be filled now, dashed boxes stay blank.
7. **Fill advice** appears when waiting orders of the same stock could fill blanks: "Fill advice — 2 of the 6 blanks can be filled now, by orders already received", with each order listed. Otherwise: "No waiting order of this stock fits the blanks; they stay blank unless one arrives."
8. The first card carries a note: "Pushing out writes the art files and the job ticket, creates the Docket order … and records its number on the batch. You confirm on the next screen; nothing moves until then."
9. **Open batch** (or pressing anywhere on the card) opens the batch's push-out screen. **Move orders…** is on the card but not built yet.
10. In the **List** view the columns are **Batch**, **Scan code**, **Stock**, **Slots**, **Orders · lines**, **Oldest line**, **Entity**, **Tags**, **State**. Press a column heading to sort. Press a row to open the batch. **State** reads "open", "full", "releasing", "released", "pushed out · Docket …", "marked done · date" or "cancelled".
11. An empty list says "No batches to show." or, after a search, "No results for …".
12. At the foot of the page, **Pushed out** lists every pushed-out batch with its Docket number, and "Every push-out has a Docket number or a written reason. None are missing." Before the first one: "None yet."

## Pushing a batch out

1. On a full batch press **Push out 12 →** (the batch number). On a batch with blanks the button reads **Push out with 6 blanks…**.
2. The screen is headed **Push out 12 — confirm**. Check **Batch**, **Stock**, **Slots**, **Sheets per run**, **Blanks**, **Orders · lines** and **Docket send** ("ON → …" or "OFF — the payload is recorded, nothing is sent").
3. **Files that go with it** lists each file with its size. With none: "No files on this batch yet — the job ticket is generated on the batch's ticket route; art comes with the lines."
4. **The Docket order that would be sent** shows **Order**, **Customer**, **Item**, **POs**, **Cards** and the order text itself. Until the text has appeared the note reads "The confirm button stays off until the Docket order above has rendered."
5. Press **Confirm — push out 12**. "Nothing moves until you press confirm." **Not now** returns to Batches.
6. On success: "Pushed out. Docket order 85954 recorded on batch 12." If Docket's answer could not be read: "Sent, but DocketManager's answer needs a person: …". If nothing was sent: "Not sent: …".
7. A batch already in Docket says "Already in DocketManager as order #…; it will not be sent again." and cannot be confirmed.
8. **← Batches** at the top right goes back.

## A half batch

1. A batch with 12 or fewer filled slots offers **Half batch (12 at 125 sheets)…**. Its hint reads "A half batch holds 12 slots and runs 125 sheets; every order still gets its 250 cards".
2. Press it; the batch is marked half and the push-out screen opens with **Slots** reading "· half batch".
3. If it is refused, the reason shows on the card: "Refused: …".

## Marking a batch done by hand

1. Press **Mark done…** on the card. Its hint reads "Skip the remaining route steps and mark this batch done; two steps, with a reason".
2. In **Mark Batch 12 done**, type the **Reason (kept with the batch)** — at least three characters — and press **Next…**. **Cancel** closes it.
3. Read the warning: "Marking Batch 12 done skips every remaining route step by a person, with this reason kept. Nothing is printed by it."
4. Press **Yes, mark Batch 12 done**, or **Not now**.
5. The notice reads "Batch 12 marked done; 3 remaining steps skipped." and the list returns to **Open**. The batch now sits under **Done**.

## Proposals: asking for an action instead of doing it

1. Under the batches is **Proposals**: "An action is proposed with a reason and the facts present, and applied only when a person approves it."
2. In **Propose an action**, choose **For** (a batch) and **Action**: **Push a short run (half batch)** or **Mark done (skip the remaining steps)**. On the Held page an order's actions are **Push this order alone** (with **Because**: rush, stock, finishing, other), **Void this order** and **Mark done (skip the remaining steps)**.
3. Type the reason ("Why — in your words; the ledger keeps them (required)") and "anything else (optional)". Press **Propose**. For mark done the button is **Propose mark done…**, then **Yes, propose mark done**.
4. "Nothing happens on propose. A person approves it; a short run still goes through the push-out confirmation." The notice names where the decision is made: "Approve or decline it under Proposals on the Batches page" (or "on the Held page").
5. Each open proposal is a card: **Proposed by** whom and how long ago, the **Reason**, and the facts (**Target**, **Channel**, **Customer**, **Lines · cards**, **Slots** or **Stock**, **Open holds**, **Units**, **Facts as of**). Its pill reads "proposed — waiting for a decision".
6. To decide, type "a note on the decision (optional)" and press **Approve and apply**; for a short run, **Approve (then confirm the push-out)**; for mark done, **Approve…** and then, in the **Mark … done?** box, **Yes, mark … done — skip the remaining steps** or **Not now**. **Decline** declines someone else's; your own shows **Withdraw**.
7. Decided cards read "approved and applied", "declined", "withdrawn by the proposer" or "approved, but the action refused".
8. The **Action** and **For** filters narrow the list. **Show N decided** shows what has been decided; **Hide decided** hides it again.

## Held

1. Press **Held**. The line beside the heading counts "held · waiting for a fact (clear themselves) · waiting on you · waiting on a rule".
2. **Waiting for a fact** — "Nobody decides these. They clear the moment the thing arrives; the age is the only thing to watch." The rows are **Proof not approved** ("Clears on approval"; **nudge** opens the order), **No art file yet** ("Clears itself"; press **fetch now** to pull the art again) and **Waiting for its batch** ("Clears when the batch forms"). Each row says **Waiting on: the buyer** or **Waiting on: the channel**. Empty: "Nothing is waiting for a fact."
3. **Needs a decision** — "The facts are known; the shop has to choose. Answer once, or tick "always" and it never asks again." Empty: "Nothing needs a decision."
4. **Stock unknown**: "This product has never been through a batch, so its stock is not in the library. Here is what the evidence says — pick one, or type another. Your answer is remembered for this product." The table has **Evidence**, **What it says** and **Stock**, or "No evidence yet for this product: nothing of the customer's, no matching description, no Docket code." Press a stock button (the first reads, for example, **80# — answer and place it**), or type **another stock** and press **Use it**. "One press: the stock is written to the library as your assertion (with these evidence rows attached), the hold closes, and the line is placed. Next time this product arrives there is no hold."
5. **Mixed stock**: press **Split by stock** (this order only) or **Keep whole, wait for a 2-stock answer**. Tick **Always split mixed-stock orders (shop setting)** to make it the shop's rule.
6. **Over capacity**: press **Own batch + the remainder into the open one** or **Leave held**. Tick **Always split oversize orders (shop setting)** to make it the shop's rule.
7. **Held by a person** shows the note written at the station; it is "Cleared by hand".
8. After an answer the notice reads, for example, "PO 5118824933: stock 80# written to the library as your assertion; the hold is closed." or "…: split once — its lines are placed; the shop rule is unchanged."
9. The foot of the page: "A hold is never silent: each one says who it waits on and how old it is, and anything older than 2 days shows on the staff notices. Answers write back — the library, the shop setting, or the decision on the order — so the same question is not asked twice."

## The station view (Floor)

1. Press **Floor**. The first time on a device, choose **This device is the station** (Prepress, Press 1, Press 2, Cutter, Folder, Bench 1, Shipping) and type **Your name or initials (on every scan)**. Press **Remember on this device**. "Chosen once; the browser remembers it. Nothing else to type at the station."
2. The dark panel has one box: "Scan the batch ticket's barcode when it arrives and when it leaves. Nothing to type." Scan the ticket; or type the code and press **Look up**. Until then: "Scan a ticket to see the batch's route and the next expected scan."
3. The batch appears: its number, its stock, how many steps, "Docket …" or "no Docket number yet", and "HELD" if it is held. The route is a row of steps: the step you are at reads "— here", a finished step has a tick, a skipped step reads "(skipped)".
4. Press **Arrived at Press 1** when the batch reaches you. Press **Done — to Cutter** (naming the next step; "Done — route finished" on the last) when it leaves. Only the expected button is active.
5. The notice reads "Batch 12 arrived at Press 1 — D., Press 1." or "Batch 12 done with Press 1 — next Cutter."
6. A scan out of turn is refused in red, in the server's words. When the route is finished: "The route is finished — nothing is expected."
7. **A problem? Hold this batch**: type "What is wrong (shows on Held with your name and the step)" and press **Hold batch 12**. The notice: "Batch 12 held at Press 1 — it shows on Held with your name and the step."
8. **Last scans at Press 1** lists the last six scans at this station ("none yet" before the first). To change station or name press **Station: Press 1 · you: D. — change**.
9. An unknown code says "No batch answers to "…" in this shop."
10. The menu's footnote: "The job ticket's barcode is the unit id. The floor touches only Teaky; Docket keeps the record."

## Stocked goods

1. Press **Stocked goods**. The heading line: "N to pick · N picked. Pick and pack from the shelf; never a press run. Marking a PO picked writes its shipping row."
2. Each card is **PO …** with the customer, "received … ago", its lines (product · name · quantity × pack size) and a pill reading "to pick" or "picked · date". A mixed PO carries "mixed PO · ships separately".
3. Press **Mark picked…**. The box **Mark PO … picked** says "N lines for the customer. Confirming writes one shipping row for this PO — its own ship-to, this unit's token — and records who marked it and when. Nothing is printed by it."
4. Press **Yes, mark PO … picked** or **Not now**. The notice: "PO … marked picked; its shipping row is written (1 row)."
5. The card then offers **Shipping row · filename** to download the row. Before that: "Shipping row: written when marked picked."
6. Empty: "No stocked goods waiting."

## All Channel Orders, and where an order went

1. Press **All Channel Orders**: every line from every channel. "Lines arrive as orders are placed. Nothing here is a weekly pull."
2. Filter by **Channel** (All, Taylor, PageDNA, RGI portal, Email), **Lane** (All, Press run, Stocked goods), **Show** (Waiting and held, In an open batch, Pushed out, Everything) and **Search**.
3. The tiles count **Waiting for a batch**, **In open batches**, **Held** and **Order → received**.
4. The columns are **Received**, **Age**, **Channel**, **Lane**, **Order**, **Customer**, **Line**, **Product**, **Qty × pack**, **Slots**, **Stock**, **Status**, **Batch**. Press a heading to sort. **Status** reads "Waiting for a batch", "Waiting · batch 12 at 18/24", "Placed", "Held · proof", "Held · art: …", "Stocked goods · pick and pack" or "Pushed out · Docket …". A held row is tinted red; a stock of "unknown" is red.
5. Under an order number press **+ tag** to add a tag (**Pick a tag…** from the shop's list, or type a **New tag** and press **Add**, then **Done**); press **×** on a tag to remove it. In the **Tags** row above the table, press a tag once ("only …") to keep only those lines, twice ("no …") to hide them; **clear** resets.
6. Press the order number to open **Where did … go**: **Waiting on** (or **Shipped**, or **Nothing to wait on**), **Last scan**, **Entity**, **Tags**, **Order number**; then **Units** (**Unit**, **Kind**, **State**, **Where**, **Since**, **Scan code**, **Docket**, **Entity**, **Holds**), **Scans** (**When**, **Unit**, **Scan**, **Step**, **By**, **Station**; "No scan yet." before the first), **Lines** (**Line**, **Product**, **Qty × pack**, **Cards**, **Scan code**, **In unit**, **Art**) and **Pushes to Docket**. **← All Channel Orders** goes back.
7. The foot of the page: "Every row is a line, whatever channel it came from. A line's slots are qty × pack ÷ 250. "Waiting" means its batch is open and not yet full; age counts from when the customer placed the order, not from when we received it."

## Products: the stock rulings

1. Press **Products**: "N products · N without a stock · N ruled by a person".
2. **Search** by "product name, code or stock"; filter **Source:** all, person, import, history, docket.
3. Each row is the product (its name, its code beneath) and one **Stock** dropdown: "unknown — choose a stock", the shop's stocks, or "not batched". Choosing one writes your ruling: "…: stock 80# — recorded against the product as your ruling; the previous row is kept as history." or "…: not batched — recorded against the product; the previous row is kept as history."
4. **Details** opens **Source**, **Asserted**, **Evidence agrees?**, **Used** and the history (**When**, **Stock**, **By · evidence shown at the time**). **Hide** closes it. Empty search: "No products match."
5. The foot of the page: "Choosing a stock records your ruling against the product; nothing is thrown away — the previous row stays as history behind Details. "not batched" keeps the product on the hotel path."

## Settings for the floor

1. Press **Settings** in the floor's menu: **Production settings**.
2. **Batches opens as** — **Cards** or **List**. "The shop's default; a browser's own toggle on Batches overrides it there."
3. **Bridge writes batch files to the job-tickets folder** — **Off** or **On**. "Off (the default): the bridge on the shop's PC is offered no batch files and writes nothing; it only keeps the Taylor session. Switching it on is a deliberate step taken together with the shop, and every change is recorded with who made it."
4. **Tags by customer** — "Every new order of the customer gets these tags, on the channel named or on every channel. A tag set by hand stays; a rule only adds." Press **Add rule**; fill **Customer, as the channel names it**, the channel (**Every channel**, taylor, inspire, pagedna) and **Tags, comma-separated**; press **Save rules**. **Remove** drops a rule. "Every rule needs a customer and at least one tag."

## If you see "You don't have the floor role on this shop."

Your sign-in has no floor role on this shop. Ask the shop admin; nothing on these screens loads until it is granted.
