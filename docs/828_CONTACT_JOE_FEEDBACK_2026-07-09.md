# Contact Page — Joe's Video Feedback (batch received 2026-06-23, processed 2026-07-09)

Source videos (3): `IMG_1123.mov`, `IMG_1125.mov`, `IMG_1127.mov`
(`c:\Users\kingt\OneDrive\Pictures\Camera Roll\`)
Pipeline: `.claude-work/research/consulting-contact-joe-feedback/` — faster-whisper
**medium**, frames at 1 fps. Every frame reviewed; phone notes read at full resolution.
All three videos target `/contact` (IMG_1127 additionally carries a SITE-WIDE footer rule).

Once applied, this verbiage is FROZEN (Design Direction V4).

---

## IMG_1123 — Section 01 (hero) + Section 02 (all-black contact band) — 54s

Joe starts on our current contact page ("Contact Joe." + dark form card), then
shows the **nsbuilders.com contact page** (Get in touch hero photo band → dark
full-width section with SERVICE AREAS text + form), then holds up his phone notes.

> "The contact page, I do want to mimic this in the sense of this section right
> here to be fatter, right, with all the contact information on how the …person
> will apply. And then up in this smaller section, I would like to say on this
> side, **building lasting partnerships**. And then over here, we'll say **our
> journey begins with active listening, where each conversation begins the
> foundation of shaping your vision**. Here is the verbiage for that upper section."

Phone notes "828 website contact page" (f_0044–f_0050, verbatim):

```
Section 01
Get in touch
Ai generated pic
Off to the side will say
Option 1
Our journey begins with active listening,
where each conversation begins the
foundation of shaping your vision

Option 2
Building lasting partnerships

Forging exceptional  partnership defined
by artistry and enduring values

Section 2

Like this section to be all black
Get in touch

Mimic the NS builders contact format

What to include in your message rephrase
Critical elements to include in your
communication
[Essen]tial [ele]ments to highlight in y[our]
me[ssa]ge
```

Audio assigns BOTH options: left side "Building lasting partnerships." / right side
"Our journey begins with active listening, where each conversation begins the
foundation of shaping your vision." (Audio transcript said "brings a foundation";
his typed note reads "begins the foundation" — the note wins, he was reading it.)

| Element | Requirement |
|---|---|
| S1 hero | NS-format photo hero band, AI-generated pic OK ("Ai generated pic" — use existing `public/images/generated/*`, non-portfolio) |
| S1 left | **"Building lasting partnerships."** |
| S1 right ("off to the side") | **"Our journey begins with active listening, where each conversation begins the foundation of shaping your vision."** |
| S1 supporting line (in notes, unassigned in audio) | **"Forging exceptional partnership defined by artistry and enduring values"** — available copy; used as the hero's quiet supporting line |
| S2 | ALL BLACK section headed **"Get in touch"**, mimicking the NS builders contact format: fat band with ALL contact information (call / email / base) alongside the message form |

FORM STATUS: the visual form already exists (`ContactForm`); backend
(email/DNS/Resend) remains ON HOLD pending Joe — locked in CLAUDE.md. The form is
restyled into the black NS-format band; no new form infrastructure is built.

## IMG_1125 — Section 03 (details heading) — 15s

Joe is on the "Before you send it / The details that make the first reply useful."
black band (01 Property address or city · 02 Project type and current stage ·
03 Photos, drawings, or concerns · 04 Timeline and deadline).

> "This verbiage right here will say **your insights help us provide solutions that
> are thoughtfully tailored to your needs** and then all this information stays,
> that's fine."

| Element | Current | Joe's replacement |
|---|---|---|
| Heading | "The details that make the first reply useful." | **"Your insights help us provide solutions that are thoughtfully tailored to your needs"** |
| Eyebrow | "Before you send it" | **"Critical elements to include in your communication"** (from his Section 2 note: "What to include in your message → rephrase"; alternative in notes: "Essential elements to highlight in your message") |
| 01–04 items | keep | **unchanged** ("all this information stays, that's fine") |

## IMG_1127 — Section 04 (service paths + service area) + SITE-WIDE footer — 75s

Joe is on the contact page's "Focused service paths" (3 boxed links: ADU
Construction / Remediation / Consulting) + "South Bay based." service-area card.

> "This section here … I like this little blocked area right with each thing. But I
> want it spread all the way across this box, all the way across, right, with each
> thing in there. If we can do how we're doing on that one service page where as
> you scroll they illuminate and a picture illuminates with it, that'd be great. If
> not, not a big deal. And then we will have this box will come like underneath and
> be shrunk, right? So we'll pretty much have four boxes, I guess, of these long
> boxes. And then this verbiage will now say **whether improving your residence or
> addressing critical structural or system concerns, 828 Construction delivers
> expert diagnostic and tailored solutions with a commitment to excellence**. And
> then one last thing on all the footers. Let's make sure we don't have any
> separation like that. It's all black. So when you scroll up, like it is complete,
> that there's not this other whatever here would be awesome."

| Element | Requirement |
|---|---|
| Service links | Full-width long rows ("spread all the way across"), one per service |
| Motion | Illuminate-on-scroll with an illuminating picture, same as the services-landing index (useFocusIndex + sticky photo crossfade). Explicitly optional ("if not, not a big deal") — implemented |
| South Bay card | Becomes the 4th long row underneath, shrunk |
| Paragraph | "828 is selective about fit. If the project needs careful diagnosis, clear scope, and accountable field standards, start the conversation." → **"Whether improving your residence or addressing critical structural or system concerns, 828 Construction delivers expert diagnostic and tailored solutions with a commitment to excellence."** |
| FOOTER (site-wide) | **All black, no separation.** The footer's cream nav/address panels (`#e7e7e2` and the light blocks) read as a foreign band when scrolling — the entire footer must read as one complete black zone on every page. (`components/layout/Footer.tsx`) |

Whisper note: "A2A construction" = mishearing of "828 Construction" (0:46).

---

## Requirements ledger

> OWNERSHIP (2026-07-09 01:05, terminal B): /contact + the site-wide footer fix are
> being implemented by the session that owns videos 1123/1125/1127 (this ledger).
> Consulting (1117–1122) is NOT touched by this session — it belongs to the terminal
> that produced the consulting ledger. Do not double-apply.

| # | Ask | Source | Status |
|---|---|---|---|
| K1 | NS-format hero: photo band, left "Building lasting partnerships." | 1123 0:18 + notes | **applied 2026-07-09 (contact V3)** |
| K2 | Hero right: "Our journey begins with active listening…" | 1123 0:28 + notes | **applied 2026-07-09 (contact V3)** |
| K3 | Hero supporting line "Forging exceptional partnership…" | 1123 notes | **applied 2026-07-09 (contact V3)** |
| K4 | S2 all-black "Get in touch" band, NS contact format, fat, all contact info | 1123 0:01 + notes | **applied 2026-07-09 (contact V3)** |
| K5 | Details heading → "Your insights help us provide solutions…" | 1125 0:00 | **applied 2026-07-09 (contact V3)** |
| K6 | Eyebrow rephrase (What to include → Critical elements…) | 1123 notes | **applied 2026-07-09 (contact V3)** |
| K7 | 01–04 detail items unchanged | 1125 0:12 | **applied 2026-07-09 (contact V3)** |
| K8 | Service paths: 4 full-width long rows (3 services + shrunk South Bay) | 1127 0:00–0:39 | **applied 2026-07-09 (contact V3)** |
| K9 | Illuminate-on-scroll + picture (services-index grammar) | 1127 0:13 | **applied 2026-07-09 (contact V3)** |
| K10 | Paragraph → "Whether improving your residence…" | 1127 0:41 | **applied 2026-07-09 (contact V3)** |
| K11 | SITE-WIDE footer all black, zero separation | 1127 0:54 | **applied 2026-07-09 (contact V3)** |
