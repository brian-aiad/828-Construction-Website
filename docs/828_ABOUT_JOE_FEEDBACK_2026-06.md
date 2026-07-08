# About Page — Joe's Video Feedback (recorded ~2026-06-23, analyzed 2026-07-08)

Source: 5 videos in `c:\Users\kingt\OneDrive\` (Joe filming his tablet on the live
About page, pointing with a stylus; video 1020 shows his typed notes on his phone).
Full timestamped transcripts + extracted frames: `.claude-work/research/about-joe-feedback/`.

One video = one About section, top to bottom:

| Video | About section | Component |
|---|---|---|
| IMG_1014 | Hero ("Built by the work, not the pitch.") | `AboutHero` |
| IMG_1019 | Builder profile ("Experience that shows up…") | `OriginSection` |
| IMG_1020 | Method ("Plans first. Field tested.") | `FieldMethodSection` |
| IMG_1024 | South Bay ("Local work should feel accountable.") | `SouthBaySection` |
| IMG_1031 | CTA ("Tell us what you want built…") | `AboutCTA` |

---

## 1. Hero (IMG_1014)

1. **ADD backdrop wordmark:** "828 CONSTRUCTION" spanning the whole screen behind the
   hero, slightly faded. ("This would be nice to have 828 Construction that spans
   across the whole screen in the backdrop, slightly faded.")
2. **REPLACE H1** "Built by the work, not the pitch." → **"Where quality meets quiet
   luxury."** (pen on H1 at ~14s)
3. **REPLACE right-column paragraph** → **"Every home is shaped by decades of hands-on
   experience and building science, ensuring exceptional quality and performance."**

## 2. Builder profile (IMG_1019)

1. **DELETE the large headline** "Experience that shows up before the finish."
   ("Remove this larger font.")
2. **REPLACE the paragraph** → **"828 Construction is guided by a founder with over
   two decades of hands-on experience in residential construction. This depth of
   knowledge — built from working directly alongside skilled tradesmen — shapes a
   precise understanding of how homes are built and perform."**
3. **RENAME the three numbered cards** (pen on cards at ~30s):
   - 01 "Listen before scope." → **"Communication."**
   - 02 "Sequence the work." → **"Intentions."**
   - 03 "Protect the finish." → **"Execution."**
4. **REWRITE card body copy** to fit the new titles ("Rewrite the verbiage underneath
   however to accommodate those." — explicit creative license).

## 3. Method → CRAFT section (IMG_1020)

Joe holds his phone notes to the camera. Verbatim notes (typos his):

> C- Curiosity / R- Relatability / A- Alignment / F- Forged / T- Tailored /
> The word craft dropped in the back round bold. Then the acronym words.
> Curiosity. Drives how 828 builds digging deeper into details, uncovering smarter
> solutions to complex construction challenges.
> Relatability .guides are work by understanding each client's perspectives so we can
> serve with clarity
> Alignment Where intent design & execution come together seamlessly like the
> relationship between builder & Clients
> Forged through experience & precision, 828 translate our clients vision into
> remarkable spaces define with design integrity & strategy
> Tailored to each client's vision 828 approach ensures. Every detail is shaped
> through close collaboration between builder & owner for a truly bespoke result
> At bottom of the page South Bay Keep the area … maybe can have them … the screen

Directives:
1. **The word "CRAFT" dropped in the background, bold** (like a watermark), acronym
   letters running down the side, each letter expanding to its statement.
2. **Five acronym statements** (grammar cleaned, meaning preserved):
   - **C — Curiosity.** Drives how 828 builds — digging deeper into details,
     uncovering smarter solutions to complex construction challenges.
   - **R — Relatability.** Guides our work — understanding each client's perspective
     so we can serve with clarity.
   - **A — Alignment.** Where intent, design & execution come together seamlessly —
     like the relationship between builder & client.
   - **F — Forged.** Through experience & precision, 828 translates our clients'
     vision into remarkable spaces defined by design integrity & strategy.
   - **T — Tailored.** To each client's vision — 828's approach ensures every detail
     is shaped through close collaboration between builder & owner for a truly
     bespoke result.
3. This replaces the "Plans first. Field tested." content block.

## 4. South Bay (IMG_1024)

1. **ANIMATE the cities** — rolling across the screen in the background, spanning the
   whole screen (replaces the static area grid tiles).
2. **REPLACE H2** "Local work should feel accountable." → **"Looking for a local
   contractor?"**
3. **REPLACE paragraph** → **"828 Construction — servicing the South Bay for over two
   decades."**

## 5. CTA (IMG_1031)

1. **REPLACE H2** "Tell us what you want built. We will tell you how it should
   start." → **"For those who value experience and quality."**
2. **REPLACE paragraph** → **"Every exceptional home begins with a conversation. By
   listening first, we transform your vision into thoughtfully crafted reality."**
3. **Primary button** "Request an estimate" → **"Initial Contact"** ("then it could
   say initial contact").

---

## Brian's additional directive (2026-07-08)

Apply the homepage stacked-surface scroll animation (EditorialFlow: measured-sticky
surfaces, cover scale settle, plumb line) to the ENTIRE About page. This supersedes
the earlier "do not copy the homepage scroll pattern onto About" rule for the
stacked-surface grammar specifically; About keeps its own within-section reveals.

## Video-feedback intake pipeline (reusable for the next batch)

1. Drop videos anywhere (OneDrive fine); list paths in
   `.claude-work/research/<batch>/extract_and_transcribe.py` (copy from
   `about-joe-feedback/`).
2. `pip install faster-whisper imageio-ffmpeg` (already installed on desktop PC).
3. Run the script → per-video `audio.wav`, `frames/f_NNNN.jpg` (1 per 2s),
   `transcript.txt` (timestamped).
4. Read frames at the transcript timestamps to resolve every "this here" pointer.
5. Write the change doc in this format before touching code.
