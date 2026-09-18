# Process overview

**[Advanced Involution (SLOP8024)](https://comp4020-agentic-coding-studio.github.io/comp4020-ass2-AaronJin0323/)**
— a doctoral course site about involution: escalating effort for flat returns.

## What I built

A twelve-week course site for a course that does the thing it teaches. The
subject is 内卷 (_neijuan_) — Geertz's over-farmed rice paddies, 996,
publish-or-perish — and the register stays straight academic throughout,
because the joke is structural rather than verbal. The prose escalates from
week 2 to week 8 and deflates after; the late-work policy accumulates four
amendments without the five days ever changing. A reader who doesn't notice
reads a straight syllabus, which is the correct failure mode.

## How I got here

**I turned the spec into tests before writing any content.**
[`054ab08`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AaronJin0323/commit/054ab08) encodes the published spec as four assertions: twelve
dated weeks with one session each, the provisioned `024` preserved, a deck
that builds and is linked from its lecture, weights summing to 100. An agent will
cheerfully produce eleven weeks that read fine. Encoding the spec first meant
drift arrived as a red test, not as something I had to re-derive from the brief
on every review pass.

**I wrote the harness after the decisions, not before.** `CLAUDE.md` ships
deliberately empty; I filled it in at [`ad5e795`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AaronJin0323/commit/ad5e795) only with rules
for drift I had already watched happen. The register is pinned to three exemplar
files plus an escape hatch — "a joke that needs the same beat every week stops
being a joke" — because the failure mode of a tone rule is mechanical
application. The course code carries an instruction to flag a conflict rather
than "quietly comply or quietly refuse," naming both directions an agent can
wreck it. Commits and pushes need separate confirmation every time,
because standing permission is precisely what an agent infers from a streak.

**The sharpest content decision came from reading the finished site.** The
single-staff arrangement turned out to be the best instance of the mechanism on
the site, and I took the harder version of it:

> the meaner version, implicate him in the other two leaving

[`9f6411d`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AaronJin0323/commit/9f6411d) rewrote three bios so both departures are pinned on the
one remaining staff member, who now carries 卷王 in his role line.

**A green pipeline verifies only the properties you thought to encode.** That
new free-text role silently vanished from every profile page — the components
resolved `role` through an enum, and an unmatched value rendered as nothing.
`astro check`, the build, the a11y pass and the link checker were all clean;
only reading the page found it [`52d2887`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AaronJin0323/commit/52d2887). The same blind spot hid
two false claims the site made about itself: a deck counting leftover starter
boilerplate to land a joke about its own length, and a self-audit slide that
promised honesty and got all three of its bullets wrong.
[`fa6e4cf`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AaronJin0323/commit/fa6e4cf) fixes both and adds `spec/self-claims.test.ts`, pinning
each deck's stated slide count and week 8's word-count series to the actual
files, so editing a lecture now breaks the build until the slide describing it
is updated too. I verified those tests by mutation rather than by a green run.

**Artwork as a program.** [`32dd6e0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AaronJin0323/commit/32dd6e0) replaces the four hash-gated
starter images using `tools/generate-artwork.mjs`, a deterministic generator,
so the artwork is reproducible and reviewable as source rather than five
opaque binaries.

![Three portraits in flat gold and black on cream: a long-haired person turned in three-quarter view, a bearded person, and a person with a hard side part](docs/portraits.png)

I used Opus for content and judgement and Sonnet for mechanical passes — a cost
decision, since a wrong answer in a mechanical pass is obvious on sight.
