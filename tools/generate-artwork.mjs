// Generates the site's artwork: a two-ink risograph treatment (brand gold and
// ink black on warm cream) shared by the hero, the social card and the three
// staff portraits, so every image reads as one print run.
//
//   node tools/generate-artwork.mjs
//
// Colours come from astro-theme-slop's palette (--at-primary / --at-secondary)
// rather than being picked by eye, so the artwork tracks the brand tokens the
// rest of the site derives from.
import sharp from "sharp";

const GOLD = "#b97d1c";
const DEEP = "#8a5c13";
const INK = "#1b1a18";
const CREAM = "#fdf3e0";

/** The two ink plates never line up exactly on a real duplicator, and the
 *  paper takes the ink unevenly. Both effects are one filter each. */
const grain = (seed, scale = 0.9) => `
  <filter id="grain" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="${scale}" numOctaves="3" seed="${seed}" result="n"/>
    <feColorMatrix in="n" type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="linear" slope="0.14"/></feComponentTransfer>
  </filter>`;

/** Concentric seating arcs, sweeping out past the left and right edges. The
 *  dash pattern reads as individual seats; rows nearer the stage are heavier. */
function seatingRows(cx, cy, first, last, step, stroke) {
  const rows = [];
  for (let r = first, i = 0; r <= last; r += step, i++) {
    const w = 10 + i * 1.6;
    const seat = 26 + i * 3;
    const y = cy + r;
    rows.push(
      `<path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy}"
         fill="none" stroke="${stroke}" stroke-width="${w}"
         stroke-dasharray="${seat} ${Math.round(seat * 0.42)}" stroke-linecap="butt"
         opacity="${0.92 - i * 0.015}" data-y="${y}"/>`,
    );
  }
  return rows.join("\n");
}

function hero(w, h) {
  const cx = w / 2;
  const cy = -980;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${grain(7, 0.8)}
    <rect width="${w}" height="${h}" fill="${CREAM}"/>
    <!-- gold plate, printed first and slightly out of register -->
    <g transform="translate(9,6)" opacity="0.95">
      ${seatingRows(cx, cy, 1180, 2560, 170, GOLD)}
    </g>
    <!-- ink plate -->
    <g>
      ${seatingRows(cx, cy, 1265, 2560, 170, INK)}
    </g>
    <!-- the stage: a flat band, a lectern, and the one gold spill on it -->
    <rect x="0" y="${h - 96}" width="${w}" height="96" fill="${INK}"/>
    <rect x="0" y="${h - 104}" width="${w}" height="10" fill="${DEEP}" opacity="0.8"/>
    <path d="M ${cx - 62} ${h - 96} l 18 -128 h 88 l 18 128 z" fill="${INK}"/>
    <rect x="${cx - 54}" y="${h - 232}" width="108" height="20" rx="4" fill="${GOLD}"/>
    <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.5"/>
  </svg>`;
}

function card(w, h) {
  const cx = w / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${grain(3, 1.1)}
    <rect width="${w}" height="${h}" fill="${INK}"/>
    <g opacity="0.5" transform="translate(6,4)">
      ${seatingRows(cx, -520, 660, 1500, 120, DEEP)}
    </g>
    <g opacity="0.22">
      ${seatingRows(cx, -520, 700, 1500, 120, GOLD)}
    </g>
    <rect x="0" y="0" width="${w}" height="${h}" fill="${INK}" opacity="0.45"/>
    <g font-family="Georgia, 'Times New Roman', serif" text-anchor="middle">
      <text x="${cx}" y="252" font-size="46" letter-spacing="14" fill="${GOLD}"
        font-family="Helvetica, Arial, sans-serif">SLOP8024</text>
      <text x="${cx}" y="376" font-size="104" fill="${CREAM}">Advanced Involution</text>
      <text x="${cx}" y="452" font-size="34" fill="${CREAM}" opacity="0.72"
        font-style="italic">more effort, the same return</text>
    </g>
    <rect x="${cx - 120}" y="500" width="240" height="4" fill="${GOLD}"/>
    <text x="${cx}" y="560" font-size="26" letter-spacing="6" text-anchor="middle"
      font-family="Helvetica, Arial, sans-serif" fill="${CREAM}" opacity="0.6">SLOP UNIVERSITY</text>
    <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.6"/>
  </svg>`;
}

/** One portrait construction, varied by a few shape parameters, so the three
 *  staff photographs look like they were taken in the same sitting.
 *
 *  Two inks only: the backdrop is a light tint of the same gold the face is
 *  printed at full strength, which is what keeps the head off the circle
 *  behind it. Hair is drawn as positive shapes laid over the face rather than
 *  punched out of a mass — an even-odd hole whose ellipse hangs past the edge
 *  of its mass fills the overhang instead of clearing it, and the portrait
 *  comes back wearing a balaclava. */
function portrait({ seed, hair, beard = "", turn = 0 }) {
  const s = 800;
  const cx = 400;
  // The head turns inside a fixed hair silhouette: one side of the hair
  // covers more of the face than the other, which is the whole of what makes
  // a flat portrait read as three-quarter rather than straight-on.
  const fx = cx + turn;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
    ${grain(seed, 1.2)}
    <rect width="${s}" height="${s}" fill="${CREAM}"/>
    <circle cx="${cx}" cy="360" r="256" fill="${GOLD}" opacity="0.4"/>
    <!-- neck, drawn before the shoulders so they close over it -->
    <rect x="${cx - 46}" y="452" width="92" height="170" fill="${DEEP}" opacity="0.85"/>
    <!-- shoulders, cropped by the frame -->
    <path d="M 96 ${s} C 96 668 232 604 ${cx} 604 C 568 604 704 668 704 ${s} Z" fill="${INK}"/>
    <!-- face -->
    <ellipse cx="${fx}" cy="352" rx="146" ry="180" fill="${GOLD}"/>
    ${beard}
    ${hair}
    <!-- eyes, and the notch of a nose. Nothing else survives a two-ink
         reduction, and a mouth drawn this flat only ever reads as a smiley. -->
    <rect x="${fx - 86}" y="338" width="58" height="13" rx="6" fill="${INK}"/>
    <rect x="${fx + 28}" y="338" width="58" height="13" rx="6" fill="${INK}"/>
    <path d="M ${fx + 4} 384 v 40" fill="none" stroke="${DEEP}" stroke-width="10"
      stroke-linecap="round" opacity="0.8"/>
    <rect width="${s}" height="${s}" filter="url(#grain)" opacity="0.8"/>
  </svg>`;
}

// Long hair, drawn as one continuous path — outer silhouette up over the
// crown and down, then back along the inner edge and across the hairline — so
// the lengths meet the cap without a seam at each temple.
const marisol = portrait({
  seed: 11,
  turn: 22,
  hair: `
    <path d="M 222 656 C 196 520 200 378 238 266
             C 268 176 330 138 400 138 C 470 138 532 176 562 266
             C 600 378 604 520 578 656 L 506 656
             C 528 540 526 400 504 330 C 488 272 450 246 400 246
             C 350 246 312 272 296 330 C 274 400 272 540 294 656 Z"
      fill="${INK}"/>`,
});

// Short hair, high at the temples, and a close beard along the jaw.
const idris = portrait({
  seed: 23,
  beard: `<path d="M 262 392 C 270 502 330 542 400 542 C 470 542 530 502 538 392
           C 528 478 462 508 400 508 C 338 508 272 478 262 392 Z" fill="${INK}"/>`,
  hair: `
    <path d="M 264 330 C 260 202 322 158 400 158 C 478 158 540 202 536 330
             C 522 264 496 238 454 232 C 418 250 382 250 346 232
             C 304 238 278 264 264 330 Z" fill="${INK}"/>`,
});

// Short hair with a hard side part: the only one of the three still cutting it.
const aaron = portrait({
  seed: 37,
  hair: `
    <path d="M 254 340 C 250 190 320 148 400 148 C 480 148 550 190 546 340
             C 532 262 506 236 470 228 C 428 268 348 264 308 236
             C 280 252 264 288 254 340 Z" fill="${INK}"/>`,
});

const out = async (svg, path, fmt) => {
  const pipe = sharp(Buffer.from(svg));
  await (fmt === "png" ? pipe.png({ compressionLevel: 9 }) : pipe.avif({ quality: 62 })).toFile(path);
};

await out(hero(2560, 1086), "src/assets/images/hero-home.avif", "avif");
await out(card(1200, 630), "src/assets/images/card.png", "png");
await out(marisol, "src/content/people/marisol-quaye.avif", "avif");
await out(idris, "src/content/people/idris-fenn.avif", "avif");
await out(aaron, "src/content/people/aaron-jin.avif", "avif");
console.log("wrote 5 images");
