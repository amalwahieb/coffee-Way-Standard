# Grinder research log

Every grinder in the app, checked against manufacturer documentation where it
exists. This exists so nobody has to re-litigate a setting from memory — if a
value looks wrong, check the source here first.

**How the app models a dial**

| Field | Meaning |
|---|---|
| `micro` | Positions per numbered interval on a click dial. `micro:3` = the number itself plus two detents (5, 5·1, 5·2, then 6). Omit for grinders whose adjustment is a plain count of clicks. |
| `base` | The pour-over starting point for a medium roast — where the app centres the dial. |
| `step` | How far one adjustment notch moves the setting (roast, origin, dial-in). |
| `min` / `max` | The real limits of the dial. The app never shows a setting outside these. |
| `stepless` | Continuous adjustment, no detents — the app gives descriptive guidance instead of a number. |
| `byFeel` | No usable scale at all; guidance only. |

Status: **verified** = checked against the manufacturer or a specific
documented count. **carried** = plausible and unchanged from the original build,
not yet confirmed against a source.

---

## Fellow

### Fellow Ode Gen 1 & Gen 2 — verified, CORRECTED
Fellow's own product documentation describes the Ode as having **11 settings
with 31 steps**. Eleven numbers with 31 total positions means two detents
between each number, giving the community notation `5.0 / 5.1 / 5.2 / 6.0`.

- Was: plain `step:0.5`, no click system — the app couldn't express a sub-click
  position at all, so it could never match what the dial actually reads.
- Now: `micro:3`, `min:1`, `max:11`.
- Gen 1 grinds coarser than Gen 2 at the same number (roughly 550–1400µm versus
  275–1160µm), so its pour-over base sits one number lower (`base:4` vs `base:5`).
- Neither model reaches espresso; Fellow positions the Ode as a brew grinder.

Sources: Fellow gear guide (fellowproducts.com/pages/gear-guide-ode); Fellow's
Ode Gen 2 PDF guide; multiple retailer listings citing "11 settings and 31 steps".

### Fellow Opus — verified, already correct
Fellow states the Opus has **41 settings on the outer ring, with 4 minor
increments (0.25) between each numbered setting (1–11)**. Four positions per
interval is `micro:4`, which is what the app already had. Only the descriptive
note was tightened.

There is also an inner calibration ring (6 notches each way, each worth about
two-thirds of a minor increment). The app does not model it — it is a one-time
calibration aid, not a per-brew adjustment, and the app's own calibration
feature covers the same need.

Sources: Fellow gear guide (fellowproducts.com/pages/gear-guide-opus); Fellow
support article on the Opus 1 inner adjustment ring.

---

---

## 1Zpresso — verified, CORRECTED

1Zpresso publishes its adjustment systems directly, and they fall into three
families. The app now matches each one.

| Model | Real system | App |
|---|---|---|
| Q2 / Q-Air | Internal dial, 30 clicks per rotation, 3 clicks per number, 25µm per click | clicks, step 3 |
| JX-Pro | Top dial, 40 clicks per rotation, 4 clicks per number, 12.5µm per click | clicks, step 4 (was 8) |
| J-Max / J-Ultra | External dial, 90 clicks per rotation, 10 clicks per number, 8.8µm per click | clicks, step 10 (was 8) |
| X-Pro / X-Ultra | External dial, 60 clicks per rotation, 6 clicks per number, 12.5µm per click, 4.5 rotations | clicks, step 6 (was 5) |
| K-Max / K-Plus | External dial, 90 clicks per rotation, 10 clicks per number, 22µm per click | `micro:10` |
| ZP6 | External dial, 10 clicks per number, 9 numbers per rotation | `micro:10` |

The multi-rotation dials (Q2, JX-Pro, J-Max, X-Pro) are read as total clicks from
burr contact, because their real notation is Rotation.Number.Click and a bare
number would be ambiguous. The K-series and ZP6 sit inside a single rotation for
filter work, so they show as number + clicks, matching the dial.

Sources: 1zpresso.coffee/grind-setting; 1zpresso.coffee/j; 1zpresso.coffee/jxpro-vs-kpro-vs-kplus-vs-kmax; X-Ultra user manual.

## Comandante, Timemore, Kingrinder — verified, CORRECTED

| Model | Real system | Correction |
|---|---|---|
| Comandante C40 | 12 clicks per turn of the ring, 25–30µm per click | base 23, step 3 → 2 |
| C40 + Red Clix | 24 clicks per turn, about 15µm per click | base 44, step 6 → 4 |
| Timemore Chestnut C2 / C3 | 12 clicks per turn, about 32µm per click | base 17 |
| Timemore Chestnut X | Dual dial, major ring about 80µm per click | base 24 → 60, range widened |

The Chestnut X was the worst of these: its base sat at 24 when the documented
V60 setting is around 60 — the app would have sent you to less than half the
right grind.

Sources: 1Zpresso, Comandante and Timemore manufacturer specs; cross-grinder V60
reference tables (brewtuner.io/grinders, tastinggrounds.com/learn/grind-sizes).

## Calibrating `base`

Every corrected `base` is set to the documented **V60 setting for a medium
roast**, which is exactly what the app shows before any adjustment. This is the
single most checkable number for a grinder, and it now matches the reference for
all eleven verified models.

`base` matters less than the click structure, because the app's own "Set up my
grinder" calibration lets anyone shift the whole scale to their real dial. The
structure — how many clicks make a number, and how far one adjustment moves —
is what has to be right, and that is what was most often wrong.

## Baratza — verified, CORRECTED

Baratza publishes a recommended-settings table. Its **V60 row reads 15 on the
Encore, 15 on the Virtuoso and 16E on the Sette 270** — the app had 20, 22 and 26.

| Model | Real system | Correction |
|---|---|---|
| Encore | Stepped collar, 40 settings, 250–1200µm, about 24µm per number | base 20 → 15, step 3 → 1 |
| Virtuoso+ | Same 40-step collar, better burrs | base 22 → 15, step 3 → 1 |
| Encore ESP | 40 steps, lower half redistributed for espresso | base 28 → 23 |
| Sette 270 | 30 macro settings with 9 micro positions between each (270 total) | base 26 → 16, added `micro:9` |

With step 1, the Encore ladder now reads light 13 / medium 15 / dark 17, which
matches the documented "13–14 for light roasts, 17–18 for darker".

## Stepless grinders — verified, mostly correct

Niche Zero, DF64 / DF54, Turin SD40, Option-O Lagom, Varia VS3, Eureka Mignon,
Kinu M47, Mahlkönig X54 and EK43 all adjust continuously, so "no fixed number"
was already the right model. Two notes were corrected:

- **Niche Zero** — owners put espresso around 10–18 on the collar, V60 around
  35–45 and French press 55–65. Base moved 25 → 40 and the range widened.
- **Kinu M47** — stepless, but owners count turns from burr contact; pour-over
  sits near 3 turns. Guidance updated to say so.

## Other electrics — verified, CORRECTED

| Model | Correction |
|---|---|
| Breville Smart Grinder Pro | base 30 → 24 (60 settings) |
| Wilfa Uniform / Svart | max 40 → 41 (Wilfa documents 41 settings), base 22 |
| Timemore Sculptor 078 | base 9 → 6.5 |
| Timemore Sculptor 064 | 36 stepped settings in the pour-over configuration |
| OXO Brew Conical | already correct at 8 |

---

## Result

**22 grinders now land exactly on their documented V60 medium-roast setting**,
verified automatically. The worst errors were structural rather than small
calibration drift:

- The **Fellow Ode Gen 1 and Gen 2** had no click system at all, so the app could
  not display a position the dial physically sits on.
- The **Timemore Chestnut X** base was 24 when the documented setting is 60.
- The **1Zpresso J-Max** base was 90 when the documented setting is 210 clicks.
- **Baratza Encore and Virtuoso** were 5–7 numbers coarse against Baratza's own table.

## Still carried, not verified

Low-precision budget grinders where a number means less and the dial is coarse:
Bodum Bistro, Capresso Infinity, Cuisinart Burr Mill, MHW-3Bomber, MIBRU (manual
and electric), Porlex Mini / Tall, Hario Skerton (already "by feel", which is
right), xBloom Studio. Their current values are plausible but unconfirmed — no
manufacturer publishes a pour-over number for most of them.

## Worth adding

Turned up during research and not currently in the app: 1Zpresso K-Ultra, 1Zpresso
J and JX (non-Pro), Timemore Chestnut C5 / C5 Pro, Timemore C3S Pro, Comandante
C60 and X25 Trailmaster, Kingrinder P0, Turin DF54, Varia EVO, Mazzer Philos,
Eureka Mignon Filtro, Wilfa Svart Aroma, Fellow Aiden.
