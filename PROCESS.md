# Process overview

**[Advanced Involution (SLOP8024)](https://comp4020-agentic-coding-studio.github.io/comp4020-ass2-AaronJin0323/)**
— a doctoral course site about involution: escalating effort for flat returns.

## What I built

A twelve-week course site for a course that does the thing it teaches. The
subject is 内卷 (_neijuan_) — Geertz's over-farmed rice paddies, the 2020
Chinese internet's word for the same trap, 996, publish-or-perish. The site is
written in a straight academic register throughout, because the joke is
structural rather than verbal: the prose escalates in register from week 2 to
week 8 and deflates after; the late-work policy accumulates four amendments
without the five days ever changing; the homepage promises four escalating
deliverables that turn out to describe one case, one discussion, one response.
Nothing winks. A reader who doesn't notice reads a straight syllabus, which is
the correct failure mode for the bit.

## How I got here

### I turned the spec into tests before writing any content

The first thing I committed was
[`054ab08`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AaronJin0323/commit/054ab08):
the published spec as four executable assertions in `spec/assignment-2.test.ts`
— twelve dated weeks with exactly one session each, the provisioned trailing
`024` preserved in the course code, at least one lecture carrying a deck that
actually builds _and_ is linked from its own page, assessment weights summing
to 100.

This was the highest-leverage thing I did. An agent generating twelve weeks of
content will cheerfully produce eleven, or two sessions in week 6, and the
prose will read fine either way. Encoding the spec first meant drift showed up
as a red test I could hand straight back, instead of as something I had to
re-derive from the brief on every review pass.

### The concept, and the one identifier I couldn't move

The repo arrived provisioned as `SLOP1024`
([`f9cfdeb`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AaronJin0323/commit/f9cfdeb),
starter). A doctoral course needs an 8000-level code, so
[`f31c9b2`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AaronJin0323/commit/f31c9b2)
moved it to `SLOP8024` — and had to move `level` with it, because
`course-config.ts` has a zod refinement cross-checking the level field against
the code's fifth character. The trailing `024` is the repo's identity and never
moves; the spec test pins it.

### I wrote the harness after the decisions, not before

`CLAUDE.md` ships deliberately empty, with a note saying so. I filled it in at
[`ad5e795`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AaronJin0323/commit/ad5e795),
and only with rules for decisions I had already made and then watched the agent
drift off:

- **The register**, pinned to three named exemplar files rather than a formula
  — plus an explicit escape hatch, "a joke that needs the same beat every week
  stops being a joke," because the failure mode of a tone rule is an agent
  applying it mechanically.
- **The course code**, with an instruction to flag a conflict and let me decide
  rather than "quietly comply or quietly refuse" — naming both failure
  directions, since an agent can wreck an identifier just as easily by
  refusing to discuss it.
- **Separate confirmation for every commit and every push**, with "ask again
  even if the last five were all yes," because standing permission is exactly
  what an agent infers from a streak.
- **`published: false` over deletion** for superseded content.

The rules that earned their place are the ones written _after_ the mistake.

### The teaching team became the case study

[`c5df520`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AaronJin0323/commit/c5df520)
consolidated the staff to one person covering convenor, lecturer and tutor
simultaneously, and hid the other two as unpublished records. Reviewing the
finished site, I noticed the arrangement was itself an instance of the
mechanism and said so:

> another trick here is that there is only 1 staff working which is also a
> behavoir of involution, who will be the incolution king

That produced a choice — leave the two departures as a faceless restructure, or
make the remaining staff member causally responsible. I took the second:

> the meaner version, implicate him in the other two leaving

[`9f6411d`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AaronJin0323/commit/9f6411d)
republished both as emeritus profiles — visible, not erased — and rewrote all
three bios to tell one staffing incident from three desks: he covered the
founding convenor's leave at his own offer, kept the seminars, absorbed the
even-week crits, and the two positions he had been covering were not renewed.
It also added 卷王 (_juanwang_, "involution king") to week 3's vocabulary, the
one term in the _neijuan_ lexicon naming a person rather than a system, and
recorded the causal line in `CLAUDE.md` so a later pass wouldn't soften it back.

### A bug no check could see

The new free-text role — `Convenor, Lecturer & Tutor; 卷王 (Involution King)` —
silently vanished from every profile page. `PeopleGrid.astro` and
`people/[slug].astro` were looking the role up in a `convenor|tutor|guest|other`
enum, and an unmatched value rendered as nothing at all.

`astro check` was clean. The build was clean. Zero a11y violations, zero broken
links, all spec tests green. The Role line was just gone, and only a visual read
of the built page found it. Fixed in
[`52d2887`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AaronJin0323/commit/52d2887).
This is the clearest lesson in the repo: a green pipeline verifies the
properties you thought to encode, and nothing else.

### Artwork as a program, not five binaries

The four starter images are hash-gated, so they had to be genuinely replaced.
[`32dd6e0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AaronJin0323/commit/32dd6e0)
adds `tools/generate-artwork.mjs`, a deterministic SVG-to-raster generator, so
the artwork is reproducible and reviewable as source: a two-ink risograph in the
brand gold and ink, seeded grain, five outputs. The hero is a raked theatre of
dashed seat-rows with one small lectern at the bottom of it, which does the
one-staff joke without saying it.

![Three portraits in flat gold and black on cream: a long-haired person turned in three-quarter view, a bearded person, and a person with a hard side part](docs/portraits.png)

The portraits took six iterations, all geometry failures, and one was worth
keeping: with `fill-rule="evenodd"`, combining a hair mass and a face-cutout
ellipse in one path leaves the part of the ellipse hanging _below_ the mass with
a crossing number of 1 — so it fills instead of clearing, and every portrait
came out wearing a balaclava. The fix was to abandon even-odd and draw hair as
positive shapes over the face. It's recorded as a comment in the generator,
because it is precisely the kind of thing an agent will re-attempt.

I also rewrote the three `photoAlt` strings, which were generic enough
("a person facing the viewer") to be swapped for each other without anyone
noticing — a real accessibility defect that an automated a11y checker scores as
a pass, since the attribute was present and non-empty.

### How I knew it was right

`pnpm check` runs `astro check`, a full build — pagefind indexing, an a11y
checker, a base-path link check, a broken-links checker and `astromotion` deck
validation across 39 pages — and the spec tests. `pnpm check:evidence` gates the
submission itself. Both are green.

What the checks could not see, I found by measuring the thing the text asserts,
and it was the site's claims about itself that failed — the one category of
error a build can never catch, and the one this particular site can least
afford. Week 12's deck landed the punchline "This deck has five slides," and
the fifth slide was leftover starter boilerplate: the joke was counting the
template to make its point. Week 8's self-audit slide was worse, because it
promised "applying the instrument above, to this document, honestly" and then
got all three of its bullets wrong.

So I ran the instrument. The lectures measure 79, 58, 103, 63, 72, 55, 70, 69,
67, 65, 55, 86 words: the curve peaks at weeks 3 and 12 — the two plainest
weeks on the syllabus — and week 8, billed as the local maximum, is a local
dip. The escalation this course performs is real; it lives in register rather
than length. [`fa6e4cf`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AaronJin0323/commit/fa6e4cf)
rewrites the slide to report that, which is a better joke than the false one
was, and drops the starter block from all three decks.

The same commit adds `spec/self-claims.test.ts`, because noticing this once is
not a method. It pins every deck's stated slide count against its rendered
sections, week 12's cross-reference to week 8, and week 8's stated series
against a fresh count of the lecture files — so editing a lecture now breaks
the build until the slide that describes it is updated too. I checked the tests
by mutation rather than trusting a green run: restoring "five slides" and
padding week 5 by a single bullet each fail two tests.

This is the same blind spot that hid the missing role line, and the honest
lesson of both is that I found them by reading, not by testing. The tests exist
so that the next person doesn't have to.

I used Opus for content and judgement work and Sonnet for mechanical passes —
six commits co-authored with the former, four with the latter. The split is not
a preference so much as a cost decision: the mechanical passes are the ones
where a wrong answer is obvious on sight, so a cheaper model is the right tool.
