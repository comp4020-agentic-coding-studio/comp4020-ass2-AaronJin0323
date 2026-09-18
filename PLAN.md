# Plan: submission-ready, and the site performs its own joke

## Context

This repo is a COMP4020/COMP8020 Assignment 2 submission: an Astro course
site for "Advanced Involution" (`SLOP8024`), a satirical doctoral course
whose thesis is escalating effort for diminishing returns. The 12-week
curriculum, both assessments, and a prose-register joke across weeks 2–12
(rhetoric escalates in jargon through week 8, then deflates) were already
built. This plan covers what's left before submission, aimed at two goals
at once:

1. **Close the submission gates.** `pnpm check:evidence` — the actual
   final gate — currently fails on: leftover `STARTER_CONTENT` markers,
   an unwritten `PROCESS.md` still carrying its `TEMPLATE:` comment with
   no real commit citations, and four image assets still byte-identical
   to the original starter files (`card.png`, `hero-home.avif`,
   `marisol-quaye.avif`, `idris-fenn.avif`).
2. **Extend the joke from described to experienced.** So far the site
   *talks about* involution. The remaining surfaces — the homepage pitch,
   the policies page, the assessments-intro framing, and a second slide
   deck — should make a reader *perform* the mechanism (read more, get
   told the same thing in fancier words) before naming it, so the payoff
   lands as "wait — I just did the thing," not another explanation of it.

## Decisions locked in

- **Teacher status**: Marisol Quaye and Idris Fenn are restored to
  `published: true` as visible **founding/emeritus faculty** — real
  profile pages, back in the People grid — but every session/lecture's
  `teachers:` field stays `[aaron-jin]` only. Their bios explain why
  they're pictured but not teaching: the department "identified
  efficiencies" and consolidated their roles onto Aaron — an extra beat
  of the same joke, not just a retcon. *(Done — see Phase 1 below.)*
- **Experience scope**: copy (homepage, policies, assessments intro) plus
  two more slide decks (week 8, week 12) carry the mechanic. No new
  navigation tricks — not worth the risk to the axe/broken-link checks
  that gate the build.
- **Images**: sourced from a Figma file, via the Figma MCP connection.
  Exact specs: `hero-home.avif` 2560×1086, `card.png` 1200×630,
  `marisol-quaye.avif` / `idris-fenn.avif` 800×800 each.

## Phase 1 — Restore Marisol & Idris as emeritus faculty — DONE

- `src/content/people/marisol-quaye.md`, `idris-fenn.md`: `published: true`,
  bios reframed as consolidated-away founding faculty.
- `src/content/people/aaron-jin.md`: one-line addition tying his solo role
  back to the same "identified efficiencies" consolidation.
- `CLAUDE.md`: sharpened the single-teacher bullet to clarify Marisol/Idris
  are published profiles, not active staff, and must never appear in a
  `teachers:` field.
- Bug fix while in this area: `src/pages/people/[slug].astro` and
  `src/components/PeopleGrid.astro` mapped `role` through a
  `convenor|tutor|guest|other` enum lookup, but `content.config.ts` already
  overrides `role` to free text — so the Role line was silently dropping
  on every profile, including Aaron's existing one. Fixed to render
  `person.data.role` directly, with a substring-based rank for grid
  ordering instead of an exact enum match.

## Phase 2 — Source and wire the four real images — DONE, DIFFERENTLY

- Get the Figma file/frames from the user; authenticate via
  `mcp__plugin_figma_figma__authenticate`.
- Export at the exact dimensions above, replacing the four files in place
  (same paths/filenames) — no frontmatter or `site-config.ts` changes
  needed.
- Re-hash all four (`shasum -a 256`) to confirm none match the starter
  hashes baked into `scripts/check-evidence.ts`.
- Non-blocking side question: Aaron currently has no `photo`/`photoAlt` —
  worth a portrait too, now the other two have one again.

## Phase 3 — Homepage (`src/pages/index.astro`) — DONE

- Remove both `STARTER_CONTENT` markers.
- Rewrite "What you will do" / "Who it is for" so the promised
  workload/value escalates in *demands* without escalating in what's
  actually delivered — the setup; the payoff lands in Phase 4.

## Phase 4 — Policies page (`src/pages/policies/index.mdx`) — DONE

Currently unwritten. The main canvas for "reader performs the joke,"
since policy bloat is a real-world involution case study the 12 weeks
haven't covered.

- Real, load-bearing content (late work, extensions, academic integrity),
  structured so getting the one fact you came for requires reading through
  escalating procedural overhead — e.g. an "amendment history" that adds
  process across revisions while the actual rule never changes.
- Close with an explicit line naming the mechanism for anyone who reads to
  the end — the "sudden enlightenment" beat — checking it lands alongside
  week 12's already-deflated closing lecture rather than duplicating it.

## Phase 5 — Assessments index intro (`src/pages/assessments/index.mdx`) — DONE

Light touch: the marking-criteria description performs escalating scrutiny
language for the same two unchanged assessments.

## Phase 6 — Two more decks — DONE

- `src/decks/week-08.deck.mdx` (peak jargon, pairs with week 8's lecture),
  `slides: /decks/week-08/` added to `week-08.md`.
- `src/decks/week-12.deck.mdx` (plain, deflated, names the trick on its
  last slide), `slides: /decks/week-12/` added to `week-12.md`.
- Modeled on `src/decks/week-01.deck.mdx`'s structure (title slide, content
  slides, one `_class: impact` slide, closing slide), reusing `theme.css`.
- Verify against `spec/assignment-2.test.ts`'s deck checks.

## Phase 7 — `PROCESS.md` (last) — DONE

- Real "What I built" / "How I got here," citing actual commit shas in the
  `` [`sha`](url) `` form `scripts/check-evidence.ts` parses and resolves.
- Delete the `<!-- TEMPLATE: -->` comment entirely.

## Phase 8 — Verification (continuous + final) — DONE

- `pnpm check` after each phase's edits, not batched to the end.
- `pnpm check:evidence` as the real finish line.
- `pnpm dev`/`pnpm preview`: eyeball homepage, policies, both new decks,
  People index (3 cards, roles now visible), social-card preview, at a
  narrow and a wide viewport.
- Per `CLAUDE.md`: confirm each commit and each push separately, phase by
  phase.

## Where the plan diverged

Kept as written rather than retconned, since what a plan got wrong is the
more useful half of it.

- **Images were generated, not sourced.** The plan assumed a Figma file
  pulled through the Figma MCP connection. No Figma file ever existed, so
  the artwork became `tools/generate-artwork.mjs` — a deterministic
  SVG-to-raster generator committed alongside its output. This is a better
  outcome than the plan's: the artwork is reviewable as source and
  reproducible, where an MCP export would have landed as five opaque
  binaries. It also answered the phase's own "non-blocking side question"
  — Aaron got a portrait, so the count is five images, not four.
- **The staffing joke got meaner.** Phase 1 has the two departures caused
  by a faceless department that "identified efficiencies." Reviewing the
  finished site, the single-staff arrangement turned out to be the sharpest
  instance of the mechanism on the whole site, and the decision changed
  mid-flight: the bios now pin both departures on Aaron's coverage becoming
  the baseline, and he carries 卷王 in his role line. `CLAUDE.md` records
  the causal line so a later pass can't soften it back.
- **A whole phase was missing.** Nothing here anticipated that the site's
  claims *about itself* would be the thing that was actually wrong — a deck
  counting leftover starter boilerplate to land a joke about its own
  length, and a self-audit slide that promised honesty and got all three
  bullets wrong. That work, and the `spec/self-claims.test.ts` that now
  pins those claims, has no phase number because the plan had no idea it
  was coming. Phase 8's "eyeball it" line is the only reason it was found.
