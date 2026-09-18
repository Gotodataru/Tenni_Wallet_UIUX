# Usability test, September 2026

Five people, one session each, about 15 minutes. Five people don't give
percentages, they surface the big problems. So everything below is counted as
"how many of five", and the case study will never say "80% of users".

**The main rule: thresholds and the planned fix are written down before anyone
sees the prototype.** Declaring success after looking at the results is an
illustration, not a test. This file is committed before the first session, and
the git history is the proof. Thresholds are not changed after the fact.

The case makes one hypothesis: *the hard part isn't buying crypto, it's
spending it safely and without mental math.* Each task below tests one piece
of that claim.

---

## Who takes part

Five people, each of whom:

- holds crypto **or** uses a mobile banking app every week;
- has **not seen** this project and doesn't know you designed it;
- is not a designer or a developer;
- reads a simple English interface (the prototype is in English; the
  conversation can be in any language).

At least **two take the test on their own phone**. Pay is a phone moment, at a
till, with one hand.

Don't invite anyone who can't tell you "this is confusing". A friend who wants
to support you spoils the test.

## Setup

- **Prototype:** https://gotodataru.github.io/Tenni_Wallet_UIUX/#test
  The app alone: no catalog, no hints, no links out. On a phone it fills the
  screen; on a laptop it shows a phone frame.
- **Reload the page before each participant** to reset every flow.
- Have this wrong-network address ready to send in a messenger (task 3):
  `0x8f3C2a1B7e4D9c6A5b0E2f1d3C4b5A6e7F8a9B0c`
- Keep the answer tables below open and type answers in **word for word**
  while the person talks. In the fightev test only a summary survived, and the
  exact counts were lost. That must not happen again.

## What to say before starting

> I'm testing the app, not you. You can't make a mistake here: if something is
> unclear, that's the app's problem. Please think out loud. I won't give hints
> or answer questions along the way, because that would spoil the result.

RU:

> Я проверяю приложение, а не тебя. Ошибиться тут нельзя: если что-то
> непонятно, это проблема приложения. Говори вслух всё, что думаешь. Подсказывать
> и отвечать на вопросы по ходу я не буду, иначе результат испортится.

Don't say what the app does. That is exactly what task 0 checks.

---

## Task 0 · Five seconds

**Question:** is it clear from the first screen what this app is for?

**How.** Show `assets/5s-home.png` full screen for **exactly 5 seconds**, then
hide it. Everything after that is from memory.

Ask in this order, write answers down verbatim, don't clarify:

1. What is this app? What can you do in it? / *Что это за приложение? Что в нём можно делать?*
2. What do you remember from the screen? / *Что запомнилось с экрана?*

**Scoring** of answer 1, did it mention:

- **A**: crypto / wallet / coins
- **B**: paying with a card / paying in shops

**Threshold (set in advance): A named by at least 4 of 5, B by at least 3 of 5.**
B has the lower bar because the card sits behind the balance on the first
screen, but spending is the product's whole point.

**If the threshold fails** (decided in advance): B missed means the card reads
as decoration. Put a one-line label under the balance, "Spend your crypto
at any card terminal", and run task 0 again with five new people.

---

## Task 1 · Pay at a till

**Question:** can a person pay from a chosen asset and say what will be taken,
without doing the math?

Open the prototype on Home. Read the scenario **word for word**:

> You're at a Starbucks. The terminal is showing your bill. Pay for it with your
> Tether, not with Ethereum.
>
> *Ты в Starbucks, терминал показывает счёт. Оплати его с Tether, а не с Ethereum.*

When they reach **Confirm payment**, stop them **before** they confirm and ask:

> How much will leave your wallet, and does that include any fees?
>
> *Сколько спишется с кошелька и входят ли в это какие-то комиссии?*

**Answer key:** 12.51 USDT (≈ $12.51); yes, the 0.9% conversion fee ($0.11) is
already included.

**Record:** the first tap on Home; whether Tether was picked; time to the
Confirm screen; the answer, verbatim; anything said aloud.

**Threshold (set in advance):**

- **1a** reaches Confirm with Tether selected, without help, within 2 minutes:
  **at least 4 of 5**.
- **1b** names 12.51 USDT (or $12.51) **and** says the fee is included:
  **at least 4 of 5**.

**If it fails** (decided in advance):

- 1a fails because they continue with the preselected Ethereum: the choice
  doesn't register. Name it on the button: "Pay with Tether" instead of
  "Continue", so the asset is repeated at the moment of the tap.
- 1a fails before the flow opens (no one finds Pay on the card or in the tab
  bar): the card reads as a picture. Give the card's Pay button a label
  with the terminal icon and move it out of the glass.
- 1b fails: the charged line is lost among four rows. Merge Purchase and fee
  into one "Charged" line with the breakdown underneath in dim text.

---

## Task 2 · Send to a saved contact

**Question:** does the send flow get a person to a correct review screen, and
do they check the address there?

> Send 0.005 bitcoin to Leo Park.
>
> *Отправь 0,005 биткоина Лео Парку.*

On the **Review transfer** screen, stop them before they confirm and ask:

> How would you make sure this is going to the right person?
>
> *Как бы ты убедился, что деньги уйдут тому, кому нужно?*

**Record:** completed without help (yes / no); time; whether they mention
comparing the address (any part of it, the grouping, first or last
characters); anything said aloud.

**Threshold (set in advance):** reaches Review with 0.005 BTC to Leo Park
without help, **at least 4 of 5**. Mentioning the address is an observation,
not a threshold: 5 people can't show whether a habit forms.

**If it fails** (decided in advance): if they stall on the amount, thinking
in dollars rather than BTC, add a BTC / USD switch above the keypad (now the
amount is typed in BTC only, with the dollar value under it). If they stall on
picking the recipient, move Recent above the address field.

---

## Task 3 · A wrong address

**Question:** when the address belongs to another network, does the person
understand **why** they can't continue, not just that the button is disabled?

Send the participant the address from Setup in a messenger. Then:

> A friend asked you for bitcoin and sent you this address. Send them 0.001 BTC.
>
> *Друг попросил биткоин и прислал этот адрес. Отправь ему 0,001 BTC.*

They paste it (long press in the field, or Paste). The field shows: *This is an
Ethereum address. BTC sent here will be lost.* When they stop, ask:

> What happened? What would you do now?
>
> *Что произошло? Что будешь делать дальше?*

**Record:** the answer, verbatim.

**Threshold (set in advance): at least 4 of 5** say in their own words that the
address is for another coin or network, **and** that they would ask the friend
for a Bitcoin address instead of trying again.

**If it fails** (decided in advance): the error names the problem but not the
next step. Rewrite it as two lines: "This is an Ethereum address" / "Ask for a
Bitcoin (BTC) address. Coins sent to the wrong network can't be recovered."

---

## Answer tables

Fill in during the session, not from memory. No names, only a number.

### Task 0

| # | device | 1. what is this app (verbatim) | 2. what they remember | A | B |
|---|---|---|---|---|---|
| 1 |  |  |  |  |  |
| 2 |  |  |  |  |  |
| 3 |  |  |  |  |  |
| 4 |  |  |  |  |  |
| 5 |  |  |  |  |  |

Result: A __ of 5 (need 4) · B __ of 5 (need 3) · **passed / failed**

### Task 1

| # | first tap | Tether picked | sec to Confirm | answer (verbatim) | 1a | 1b | said aloud |
|---|---|---|---|---|---|---|---|
| 1 |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |
| 4 |  |  |  |  |  |  |  |
| 5 |  |  |  |  |  |  |  |

Result: 1a __ of 5 (need 4) · 1b __ of 5 (need 4) · **passed / failed**

### Task 2

| # | completed | sec | how they'd check (verbatim) | mentions address | said aloud |
|---|---|---|---|---|---|
| 1 |  |  |  |  |  |
| 2 |  |  |  |  |  |
| 3 |  |  |  |  |  |
| 4 |  |  |  |  |  |
| 5 |  |  |  |  |  |

Result: completed __ of 5 (need 4) · mentions address __ of 5 · **passed / failed**

### Task 3

| # | what happened (verbatim) | what next (verbatim) | understood | said aloud |
|---|---|---|---|---|
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |
| 4 |  |  |  |  |
| 5 |  |  |  |  |

Result: understood __ of 5 (need 4) · **passed / failed**

---

## After the sessions

1. Apply the pre-written fix wherever a threshold failed, and nowhere else.
2. Add a block to the case: hypothesis → threshold → result → change →
   deviations from this protocol. A failure is worth more than a clean pass:
   it shows the test was real.
3. Always write "4 of 5", never "80%".
4. List every deviation from this protocol honestly (wrong device, a hint
   given, a participant outside the criteria), the way the fightev test did.

## What this test won't show

Five people catch big problems of understanding and navigation. They say
nothing about trust with real money, about behavior at a real till with a
queue behind you, or about whether anyone would switch wallets. The prototype
always approves the payment, so the declined path is not tested. All of this
stays open, and the case should say so.
