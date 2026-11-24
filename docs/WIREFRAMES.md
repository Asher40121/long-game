# Long Game: Wireframes

Low-fidelity layouts for the key screens. Desktop first; each screen stacks to a single column on mobile.
The 3-minute path is marked ➊ ➋ ➌: **open a target → see its fit score → generate the decision brief**.

## Global frame
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ LONG GAME   Pipeline   Portfolio        [Demo with fictional data]  ◐  ⋯     │
├──────────────────────────────────────────────────────────────────────────────┤
│                                  (screen)                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ How this works and what's stored · Reset demo data · GitHub                  │
└──────────────────────────────────────────────────────────────────────────────┘
```
`◐` = light/dark toggle. `⋯` = Reset demo data, Restart tour.

## 1. Landing (first visit)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ LONG GAME                                         [Demo with fictional data] │
│                                                                              │
│   The deal pipeline that treats the founder relationship as the asset.      │
│   Track acquisition targets and founders over years, score fit against       │
│   portfolio gaps, and turn it all into a one-page brief for leadership.      │
│                                                                              │
│   [ Explore the demo → ]      How it works ↓                                 │
│                                                                              │
│   ┌ Relationships ─────┐ ┌ Fit vs. gaps ───────┐ ┌ Decision briefs ────────┐ │
│   │ 2 founders have    │ │ Emberline fills our │ │ One page: why it fits,  │ │
│   │ gone quiet. Here's │ │ Europe gap · 69     │ │ risks, open questions,  │ │
│   │ why to call.       │ │ Strong fit          │ │ next step.              │ │
│   └────────────────────┘ └─────────────────────┘ └─────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```
"Explore the demo" opens the pipeline and starts the 3-step tour:
1. **This is your pipeline.** Founder relationships by stage; health dots show who needs a call. → highlights the Emberline card ➊
2. **Fit is measured against gaps.** → highlights Emberline's fit score and its "why" ➋
3. **Decision-ready in one click.** → highlights "Generate decision brief" ➌

## 2. Pipeline: board view
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Pipeline                                   [Board | Table]   🔍  Filter ▾    │
│ ┌ Needs attention ────────────────────────────────────────────────────────┐ │
│ │ ● Gone quiet  Ashby Collector Shows · 97 days · "Call Walt about the    │ │
│ │               spring show"                                     [Open]  │ │
│ │ ● Gone quiet  Halden & Voss · 68 days · deadline in 21 days   [Open]   │ │
│ │ ● Overdue     Graywater Archival · 52 days                    [Open]   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│ Identified  Researching  First conv.  Building   Evaluating  Diligence ▸    │
│ ┌────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ ┌──────────┐ ┌─────────┐    │
│ │Foilscope│ │Paperhawk │ │Halden &  │ │Graywater│ │Emberline ➊│ │Red Clay │   │
│ │App · <5M│ │Minis·5–15│ │Voss ●red │ │●amber  │ │TCG·15–40M│ │●green   │    │
│ │Fit 49   │ │Fit 63    │ │Fit 47    │ │Fit 70  │ │Fit 69 ●  │ │Fit 62   │    │
│ └────────┘ └──────────┘ └──────────┘ └────────┘ └──────────┘ └─────────┘    │
│   … Closing · Integration Planning · Nurture (not ready) · Passed (scroll)   │
└──────────────────────────────────────────────────────────────────────────────┘
```
Card: name, category · size band, founder name, health dot (green healthy, amber due/overdue, red gone quiet, grey not tracked), fit score. Columns scroll horizontally; Passed is collapsed by default.

## 3. Pipeline: table view
```
│ Name ▲        Stage         Fit   Health        Last touch  Size     Owner    Deal     Source      │
│ Ashby Coll.   Nurture       58    Gone quiet    97 d        <$5M     Family   Platform Outreach    │
│ Emberline     Evaluating    69    Healthy       12 d        $15–40M  Founder  Add-on   Event       │
│ …                                                                                               │
```
Every column sorts; filters for stage, category, ownership, deal type and health.

## 4. Target page (relationship tab)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ← Pipeline                                                                   │
│ Emberline Games                        Stage: [Evaluating ▾]                 │
│ Fantasy TCG publisher · Portland, OR · founded 2014                          │
│ ┌ Fit ➋ ─────────┐ ┌ Health ──────────┐ ┌ Next touch ───────────────────────┐ │
│ │ 69 Strong fit  │ │ ● Healthy        │ │ Ashveil 12th-anniversary set      │ │
│ │ Strengths: …   │ │ 12 days ago,     │ │ launches in 23 days.              │ │
│ │ Fills: Europe, │ │ every 21 days    │ │ [Log a touchpoint]                │ │
│ │ UK             │ │                  │ │                                   │ │
│ └────────────────┘ └──────────────────┘ └───────────────────────────────────┘ │
│ [Relationship] [Fit scorecard] [Decision brief ➌] [Prep*] [Diligence*]       │
│ ┌ Founder ───────────────────────────┐ ┌ Timeline ───────────────────────────┐│
│ │ Dana Okafor, Founder & Creative Dir│ │ 12 d  ▣ Meeting  Video call on what ││
│ │ What she built …                   │ │        integration would change…    ││
│ │ What matters to her                │ │ 34 d  ☎ Call     Walked Marcus …    ││
│ │  1 Team  2 Legacy  3 Staying  4 Liq│ │ 75 d  ✉ Email    NDA signed …       ││
│ │ Concerns • mass retail • release … │ │ …                                   ││
│ │ Communication style …              │ │ 610 d ★ Event    Met at trade show  ││
│ │ Key dates …   Notes …              │ │ [+ Log a touchpoint]                ││
│ └────────────────────────────────────┘ └─────────────────────────────────────┘│
│ Business: category · channel mix bar · regions · size band · ownership ·     │
│ deal type · source · strategic rationale                                     │
└──────────────────────────────────────────────────────────────────────────────┘
```
`*` Prep and Diligence tabs ship after the MVP.

## 5. Fit scorecard tab
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ 69 · Strong fit   "Strengths: close category fit and deep community ties.    │
│                    Held back by 1 high-severity risk."                       │
│ Criterion                       Weight   Rating        Points   Note         │
│ Category fit                    15 ─●─   ●●●●● 5       15.0     Core …       │
│ Channel & geographic expansion  15 ─●─   ●●●●○ 4 auto  11.3     Fills EU, UK │
│ Brand strength                  10 ─●─   ●●●●○ 4        7.5     …            │
│ … integration complexity, growth potential, leadership, community            │
│ Risk flags   ▲ high Key-person dependence (−5)  ▲ med … (−2) … total −10     │
│ How it's calculated: points = weight × (rating − 1) ÷ 4, scaled to 100,      │
│ minus risk penalties (high 5, medium 2, low 1; max 15).  [Reset weights]     │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 6. Portfolio page (gaps)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Larkspur Hobby Group (fictional) · 5 brands                                  │
│ Categories  ■ TCG publishing ■ Card accessories ■ Hobby retail ■ RPG ■ Puzz  │
│             □ Grading & storage □ Events □ Distribution □ Miniatures …       │
│ Regions     ■ US ■ Canada   □ UK □ Continental Europe □ Asia-Pacific         │
│ Channels    ■ Hobby ■ Mass retail ■ Wholesale   □ DTC □ Marketplace □ Events │
│ ■ covered  □ gap        Hover a gap → targets that would fill it             │
│ Gap                 Targets that fill it                                     │
│ Continental Europe  Emberline (69) · Halden & Voss (47) · Paperhawk (63)     │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 7. Decision brief tab
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Sample output]  Written for the demo data. Live AI is off in this demo.     │
│                                              [Copy]  [Print / PDF]           │
│ DECISION BRIEF · Emberline Games · prepared for the CFO and executive team   │
│ Recommendation  Proceed to diligence planning, conditional on …              │
│ The business    …                                                            │
│ Why it fits     …   (fit 69, fills Europe and UK)                            │
│ Key risks       …                                                            │
│ Open questions  … (for Finance and Legal to confirm)                         │
│ Next step       Owner · action · date                                        │
└──────────────────────────────────────────────────────────────────────────────┘
```
For a target the visitor created or edited, the label reads **"Assembled from your data"**: a brief built only from the fields entered, with a "What's missing" section instead of invented filler.
