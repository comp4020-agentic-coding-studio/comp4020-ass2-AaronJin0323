# Working with this repo

## Tone: satirical, deadpan-academic
Advanced Involution is a doctoral course about escalating effort for
diminishing returns, taught in a straight academic register about a
concept that is itself the joke. Keep new content in that register rather
than winking at the reader — see `lectures/week-01.md` (Geertz's rice
paddies as the founding definition), `lectures/week-05.md` (996 and Its
Discontents), and `sessions/08-grade-your-own-syllabus.md` (the course
applying its own test to itself) for the pitch. This is a register to
maintain, not a formula — a joke that needs the same beat every week stops
being a joke.

## Course identity is fixed
`SLOP8024` — never suggest or apply a code change that alters the level
digit or the trailing three digits. If a rename conflicts with that, flag
it and let me decide; don't quietly comply or quietly refuse.

## Confirm every commit and every push, separately, every time
Don't treat one approval as standing permission for the next one. Ask
again even if the last five were all "yes."

## Content conventions
- `sessions/*.md`: title, description, week, date, teachers, 2-3
  mechanically-worded spec bullets, related refs, body in
  Before/In/Afterwards form.
- `lectures/*.md`: mirrors the session it pairs with; body is an
  "Outline" with real named content (not structural filler).
- `related` edges render bidirectionally — declare them once, from
  either side, not both.
- Single active teacher (`aaron-jin`) across the whole course — convenor,
  lecturer, and tutor in one. Every `teachers:` field names only him.
  Marisol Quaye and Idris Fenn are published as emeritus/consolidated-away
  founding faculty — real profile pages, not active staff — so never add
  them to a `teachers:` field. Their bios pin both departures on Aaron's
  coverage becoming the baseline: he is the course's 卷王, glossed in
  `lectures/week-03.md`. Keep that causal line intact — don't soften it
  back to a faceless "restructure."

## Retiring content
When content is superseded but not wrong, prefer `published: false`
over deleting the file — keep the record, drop it from the live site.
